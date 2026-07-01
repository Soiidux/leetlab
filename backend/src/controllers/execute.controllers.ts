import type { Request, Response } from "express";
import { getJudge0LangName, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import { createSubmission, getSubmission } from "../db/queries/submissions.queries.js";
import { createTestCaseResult, getTestCaseResults } from "../db/queries/testCaseResults.queries.js";
import { createProblemSolved } from "../db/queries/problemSolved.queries.js";

export const executeCode = async (req: Request, res: Response) => {
  try {
    const {source_code,language_id, stdin, expected_outputs, problem_id} = req.body;
    const userId = req.user?.id;
    //Validate test cases
    if(!stdin || !expected_outputs || !Array.isArray(expected_outputs) || !Array.isArray(stdin) || stdin.length === 0 || expected_outputs.length === 0) {
      const resPayload : ApiResponse<null> = {
        status: 400,
        success: false,
        data: null,
        message: "stdin and expected_outputs must be non-empty arrays"
      }
      return res.status(400).json(resPayload);
    }

    //Prepare each test case for judge0 batch submission
    const submissions = stdin.map((input) => ({
          source_code,
          language_id,
          stdin: input,
    }));

    //Send batch submission to judge0
    const submitResponse = await submitBatch(submissions);
    //@ts-ignore
    const tokens = submitResponse.map((result) => result.token);

    //Poll judge0 for results
    const results = await pollBatchResults(tokens);

    //  Analyze test case results
    let allPassed = true;
    //@ts-ignore
    const detailedResults = results.map((result, i) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[i]?.trim();
      const passed = stdout === expected_output;

      if (!passed) allPassed = false;

      return {
        testCaseNo: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} s` : undefined,
      };
    });

    const submissionData = {
      userId,
      problemId: problem_id,
      sourceCode: source_code,
      language: getJudge0LangName(language_id),
      stdin: stdin.join("\n"),
      //@ts-ignore
      stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
      //@ts-ignore
      stderr: detailedResults.some((r) => r.stderr)
        //@ts-ignore
        ? JSON.stringify(detailedResults.map((r) => r.stderr))
        : null,
      //@ts-ignore
      compileOutput: detailedResults.some((r) => r.compile_output)
        //@ts-ignore
        ? JSON.stringify(detailedResults.map((r) => r.compile_output))
        : null,
      status: allPassed ? "Accepted" : "Wrong Answer",
      //@ts-ignore
      memory: detailedResults.some((r) => r.memory)
        //@ts-ignore
        ? JSON.stringify(detailedResults.map((r) => r.memory))
        : null,
      //@ts-ignore
      time: detailedResults.some((r) => r.time)
        //@ts-ignore
        ? JSON.stringify(detailedResults.map((r) => r.time))
        : null,
    };
    const submission = await createSubmission(submissionData);
    if (!submission) throw new Error("Failed to create submission");
    //@ts-ignore
    const testCaseResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      testCaseNo: result.testCaseNo,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));
    for (const result of testCaseResults) {
      await createTestCaseResult(result);
    }
    if(allPassed) {
      await createProblemSolved({
        userId,
        problemId: problem_id,
      })
    }

    const returnData = {
      submission: await getSubmission(submission.id),
      testCaseResuls: await getTestCaseResults(submission.id)
    }
    const resPayload : ApiResponse<typeof returnData> = {
      status: 200,
      success: true,
      data: returnData,
      message: "Submission created successfully"
    }
    return res.status(200).json(resPayload);
    
  } catch (error) {
    console.error(error);
    const resPayload : ApiResponse<null> = {
      status: 500,
      success: false,
      data: null,
      message: "Internal Server Error"
    }
    return res.status(500).json(resPayload);
  }
};
