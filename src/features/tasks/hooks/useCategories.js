import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import {
  getCategories,
  createCategory,
  deleteCategory as deleteCategoryApi,
} from "../../../services/categoryApi";

import { newId } from "../../../utils/newId";
import {
  BOARD_SCOPE,
  BOARD_MUTATION_KEY,
  syncBoardWhenIdle,
} from "../../../utils/boardMutations";

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

  const common = {
    mutationKey: BOARD_MUTATION_KEY,
    scope: BOARD_SCOPE,
    onError: (err, variables, context) =>
      queryClient.setQueryData(queryKey, context.previousCategories),
    onSettled: () => syncBoardWhenIdle(queryClient),
  };

  const addCategoryMutation = useMutation({
    ...common,
    mutationFn: (category) => createCategory(category),
    onMutate: async (category) => {
      await queryClient.cancelQueries({ queryKey });
      const previousCategories = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old) => [...old, category]);
      return { previousCategories };
    },
  });

  const deleteCategoryMutation = useMutation({
    ...common,
    mutationFn: (id) => deleteCategoryApi(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previousCategories = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old) =>
        old.filter((c) => c.id !== id),
      );
      return { previousCategories };
    },
  });

  function addCategory(name, color) {
    addCategoryMutation.mutate({ id: newId(), name, color });
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
