// All task and category mutations share ONE scope, so they run one after another.
// That guarantees "delete/move/toggle" never reaches the server before the "create" it depends on.
// One shared scope (not two) also keeps task.category_id (a foreign key) safe.
export const BOARD_SCOPE = { id: "board" };
export const BOARD_MUTATION_KEY = ["board"];

// Refetch only when the LAST pending board mutation settles.
// "=== 1" because the mutation calling this is itself still counted as pending.
export function syncBoardWhenIdle(queryClient) {
  if (queryClient.isMutating({ mutationKey: BOARD_MUTATION_KEY }) === 1) {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  }
}
