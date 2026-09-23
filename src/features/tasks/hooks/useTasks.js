import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
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

function syncWithServer(queryClient, queryKey) {
  queryClient.invalidateQueries({ queryKey });
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

  const addTaskMutation = useMutation({
    mutationFn: ({ title, status, completed }) =>
      createTask(title, status, completed),
    onMutate: async ({ title, status, completed }) => {
      const previousTasks = await snapshotAndCancel(queryClient, queryKey);
      const tempTask = {
        id: `temp-${crypto.randomUUID()}`,
        title,
        status,
        completed,
      };
      queryClient.setQueryData(queryKey, (old) => [...old, tempTask]);
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      rollback(queryClient, queryKey, context);
    },
    onSettled: () => {
      syncWithServer(queryClient, queryKey);
    },
  });

  const moveTaskMutation = useMutation({
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
    onError: (err, variables, context) =>
      rollback(queryClient, queryKey, context),
    onSettled: () => syncWithServer(queryClient, queryKey),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id) => deleteTaskApi(id),
    onMutate: async (id) => {
      const previousTasks = await snapshotAndCancel(queryClient, queryKey);
      queryClient.setQueryData(queryKey, (old) =>
        old.filter((task) => task.id !== id),
      );
      return { previousTasks };
    },
    onError: (err, id, context) => {
      rollback(queryClient, queryKey, context);
    },
    onSettled: () => {
      syncWithServer(queryClient, queryKey);
    },
  });

  const toggleTaskCompletedMutation = useMutation({
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
    onError: (err, variables, context) => {
      rollback(queryClient, queryKey, context);
    },
    onSettled: () => {
      syncWithServer(queryClient, queryKey);
    },
  });

  const updateDueDateMutation = useMutation({
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
    onError: (err, variables, context) => {
      rollback(queryClient, queryKey, context);
    },
    onSettled: () => {
      syncWithServer(queryClient, queryKey);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, categoryId }) => updateTaskCategoryApi(id, categoryId),
    onMutate: async ({ id, categoryId }) => {
      const previousTasks = await snapshotAndCancel(queryClient, queryKey);
      queryClient.setQueryData(queryKey, (old) =>
        old.map((task) => (task.id === id ? { ...task, categoryId } : task)),
      );
      return { previousTasks };
    },
    onError: (err, variables, context) =>
      rollback(queryClient, queryKey, context),
    onSettled: () => syncWithServer(queryClient, queryKey),
  });

  const updateTitleMutation = useMutation({
    mutationFn: ({ id, title }) => updateTaskTitleApi(id, title),
    onMutate: async ({ id, title }) => {
      const previousTasks = await snapshotAndCancel(queryClient, queryKey);
      queryClient.setQueryData(queryKey, (old) =>
        old.map((task) => (task.id === id ? { ...task, title } : task)),
      );
      return { previousTasks };
    },
    onError: (err, variables, context) =>
      rollback(queryClient, queryKey, context),
    onSettled: () => syncWithServer(queryClient, queryKey),
  });

  function updateTaskTitle(id, title) {
    updateTitleMutation.mutate({ id, title });
  }

  function addTask(title, status, completed) {
    addTaskMutation.mutate({ title, status, completed });
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
