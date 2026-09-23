import { supabase } from "./supabaseClient";

function mapTaskFromDb(row) {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    completed: row.completed,
    dueDate: row.due_date,
    categoryId: row.category_id,
  };
}
export async function getTasks() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  return data.map(mapTaskFromDb);
}

export async function createTask(
  title,
  status,
  completed = false,
  categoryId = null,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("tasks")
    .insert([
      { title, status, completed, user_id: user.id, category_id: categoryId },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapTaskFromDb(data);
}

export async function moveTask(id, status, completed) {
  const { error } = await supabase
    .from("tasks")
    .update({ status, completed })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function toggleTaskCompleted(id, completed) {
  const { error } = await supabase
    .from("tasks")
    .update({ completed })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function updateTaskDueDate(id, dueDate) {
  const { error } = await supabase
    .from("tasks")
    .update({ due_date: dueDate })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteTask(id) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

export async function updateTaskTitle(id, title) {
  const { error } = await supabase.from("tasks").update({ title }).eq("id", id);

  if (error) throw new Error(error.message);
}

export async function updateTaskCategory(id, categoryId) {
  const { error } = await supabase
    .from("tasks")
    .update({ category_id: categoryId })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
