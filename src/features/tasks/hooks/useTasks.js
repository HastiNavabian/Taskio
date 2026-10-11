import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { newId } from "../../../utils/newId";
import {
  BOARD_SCOPE,
  BOARD_MUTATION_KEY,
  syncBoardWhenIdle,
} from "../../../utils/boardMutations";

import {
  getTasks,
  createTask,
  deleteTask as deleteTaskApi,
  moveTask as moveTaskApi,
  toggleTaskCompleted as toggleTaskCompletedApi,
  updateTaskDueDate as updateTaskDueDateApi,
  updateTaskTitle as updateTaskTitleApi,
  updateTaskCategory as updateTaskCategoryApi,
} from "../../../services/taskApi";

async function snapshotAndCancel(queryClient, queryKey) {
  await queryClient.cancelQueries({ queryKey });
  return queryClient.getQueryData(queryKey);
}

function rollback(queryClient, queryKey, context) {
  queryClient.setQueryData(queryKey, context.previousTasks);
}

function useTasks() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const queryKey = ["tasks", user.id];

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: getTasks,
  });

  const common = {
    mutationKey: BOARD_MUTATION_KEY,
    scope: BOARD_SCOPE,
    onError: (err, variables, context) =>
      rollback(queryClient, queryKey, context),
    onSettled: () => syncBoardWhenIdle(queryClient),
  };

  const addTaskMutation = useMutation({
    ...common,
    mutationFn: (task) => createTask(task),
    onMutate: async (task) => {
      const previousTasks = await snapshotAndCancel(queryClient, queryKey);
      queryClient.setQueryData(queryKey, (old) => [
        ...old,
        { dueDate: null, categoryId: null, ...task },
      ]);
      return { previousTasks };
    },
  });

  const moveTaskMutation = useMutation({
    ...common,
    mutationFn: ({ id, status, completed }) =>
      moveTaskApi(id, status, completed),
    onMutate: async ({ id, status, completed }) => {
      const previousTasks = await snapshotAndCancel(queryClient, queryKey);

      queryClient.setQueryData(queryKey, (old) => {
        const task = old.find((t) => t.id === id);
        const rest = old.filter((t) => t.id !== id);
        return [...rest, { ...task, status, completed }];
      });

      return { previousTasks };
    },
  });

  const deleteTaskMutation = useMutation({
    ...common,
    mutationFn: (id) => deleteTaskApi(id),
    onMutate: async (id) => {
      const previousTasks = await snapshotAndCancel(queryClient, queryKey);
      queryClient.setQueryData(queryKey, (old) =>
        old.filter((task) => task.id !== id),
      );
      return { previousTasks };
    },
  });

  const toggleTaskCompletedMutation = useMutation({
    ...common,
    mutationFn: ({ id, completed }) => toggleTaskCompletedApi(id, completed),
    onMutate: async ({ id, completed }) => {
      const previousTasks = await snapshotAndCancel(queryClient, queryKey);
      queryClient.setQueryData(queryKey, (old) =>
        old.map((task) =>
          task.id === id ? { ...task, completed: completed } : task,
        ),
      );
      return { previousTasks };
    },
  });

  const updateDueDateMutation = useMutation({
    ...common,
    mutationFn: ({ id, dueDate }) => updateTaskDueDateApi(id, dueDate),
    onMutate: async ({ id, dueDate }) => {
      const previousTasks = await snapshotAndCancel(queryClient, queryKey);
      queryClient.setQueryData(queryKey, (old) =>
        old.map((task) =>
          task.id === id ? { ...task, dueDate: dueDate } : task,
        ),
      );
      return { previousTasks };
    },
  });

  const updateCategoryMutation = useMutation({
    ...common,
    mutationFn: ({ id, categoryId }) => updateTaskCategoryApi(id, categoryId),
    onMutate: async ({ id, categoryId }) => {
      const previousTasks = await snapshotAndCancel(queryClient, queryKey);
      queryClient.setQueryData(queryKey, (old) =>
        old.map((task) => (task.id === id ? { ...task, categoryId } : task)),
      );
      return { previousTasks };
    },
  });

  const updateTitleMutation = useMutation({
    ...common,
    mutationFn: ({ id, title }) => updateTaskTitleApi(id, title),
    onMutate: async ({ id, title }) => {
      const previousTasks = await snapshotAndCancel(queryClient, queryKey);
      queryClient.setQueryData(queryKey, (old) =>
        old.map((task) => (task.id === id ? { ...task, title } : task)),
      );
      return { previousTasks };
    },
  });

  function updateTaskTitle(id, title) {
    updateTitleMutation.mutate({ id, title });
  }

  function addTask(title, status, completed) {
    addTaskMutation.mutate({ id: newId(), title, status, completed });
  }
  function deleteTask(id) {
    deleteTaskMutation.mutate(id);
  }
  function toggleTaskCompleted(id, completed) {
    toggleTaskCompletedMutation.mutate({ id, completed });
  }
  function moveTask(id, status, completed) {
    moveTaskMutation.mutate({ id, status, completed });
  }
  function updateTaskDueDate(id, dueDate) {
    updateDueDateMutation.mutate({ id, dueDate });
  }
  function updateTaskCategory(id, categoryId) {
    updateCategoryMutation.mutate({ id, categoryId });
  }

  return {
    tasks,
    isLoading,
    error,
    moveTask,
    addTask,
    deleteTask,
    toggleTaskCompleted,
    updateTaskDueDate,
    updateTaskTitle,
    updateTaskCategory,
  };
}

export default useTasks;
