import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import {
  getCategories,
  createCategory,
  deleteCategory as deleteCategoryApi,
} from "../../../services/categoryApi";

function useCategories() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const queryKey = ["categories", user.id];

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: getCategories,
  });

  const addCategoryMutation = useMutation({
    mutationFn: ({ name, color }) => createCategory(name, color),
    onMutate: async ({ name, color }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousCategories = queryClient.getQueryData(queryKey);
      const tempCategory = { id: `temp-${Date.now()}`, name, color };
      queryClient.setQueryData(queryKey, (old) => [...old, tempCategory]);
      return { previousCategories };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context.previousCategories);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => deleteCategoryApi(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previousCategories = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old) =>
        old.filter((c) => c.id !== id),
      );
      return { previousCategories };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(queryKey, context.previousCategories);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  function addCategory(name, color) {
    addCategoryMutation.mutate({ name, color });
  }

  function deleteCategory(id) {
    deleteCategoryMutation.mutate(id);
  }

  return {
    categories,
    isLoading,
    error,
    addCategory,
    deleteCategory,
  };
}

export default useCategories;
