declare global {
  type User = {
      id: string;
      name: string;
      email: string;
      image: string | null;
      role: "ADMIN" | "USER";
      createdAt: Date;
      updatedAt: Date;
  } | undefined
}

export {};