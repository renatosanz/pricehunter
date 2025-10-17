import { useState, useCallback } from "react";

interface UseDeleteResult {
  isDeleting: boolean;
  error: string | null;
  deleteItem: (id: number) => Promise<boolean>;
}

export default function useDelete(
  deleteFunction: (id: number) => Promise<any>
): UseDeleteResult {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteItem = useCallback(
    async (id: number): Promise<boolean> => {
      setIsDeleting(true);
      setError(null);

      const response = await deleteFunction(id);
      if (!response?.success) {
        setError(response.message || "Error al eliminar");
        setIsDeleting(false);
        return false;
      }
      setIsDeleting(false);
      return true;
    },
    [deleteFunction]
  );

  return { isDeleting, error, deleteItem };
}
