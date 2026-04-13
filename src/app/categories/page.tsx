"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Category {
  id: string;
  name: string;
  type: string;
  color: string;
  is_archived: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [color, setColor] = useState("#3B82F6");

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_archived", false)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setCategories(data || []);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const { error } = await supabase.from("categories").insert([
      {
        user_id: user.id,
        name,
        type,
        color,
      },
    ]);

    if (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category.");
    } else {
      setName("");
      setType("expense");
      setColor("#3B82F6");
      fetchCategories();
    }
  };

  const archiveCategory = async (id: string) => {
    const { error } = await supabase
      .from("categories")
      .update({ is_archived: true })
      .eq("id", id);

    if (error) {
      console.error("Error archiving category:", error);
    } else {
      fetchCategories();
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>

      {/* Add Category Form */}
      <form
        onSubmit={addCategory}
        className="bg-white p-6 rounded-xl shadow mb-6 space-y-4"
      >
        <h2 className="text-xl font-semibold">Add Category</h2>

        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border p-3 rounded"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <div className="flex items-center gap-4">
          <label className="font-medium">Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-16 h-10 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Add Category
        </button>
      </form>

      {/* Categories List */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Your Categories</h2>

        {categories.length === 0 ? (
          <p className="text-gray-500">No categories created yet.</p>
        ) : (
          <ul className="space-y-3">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></span>
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {category.type}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => archiveCategory(category.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Archive
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
