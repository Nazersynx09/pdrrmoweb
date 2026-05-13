"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  GripVertical,
  Trash2,
  Type,
  Heading,
  Image as ImageIcon,
  Quote,
  Eye,
  X,
  Save,
  Bold,
  Italic,
  List,
  ListOrdered,
  ArrowDown,
  ArrowUp,
  Upload,
} from "lucide-react";

export type BlockType =
  | "paragraph"
  | "heading"
  | "image"
  | "quote"
  | "bullet"
  | "numbered";

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  imageUrl?: string;
  imageCaption?: string;
}

interface ContentEditorProps {
  initialBlocks?: ContentBlock[];
  onChange?: (blocks: ContentBlock[]) => void;
}

export default function ContentEditor({
  initialBlocks = [],
  onChange,
}: ContentEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(
    initialBlocks.length > 0
      ? initialBlocks
      : [{ id: "1", type: "paragraph", content: "" }],
  );
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const dragOverRef = useRef<number | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: generateId(),
      type,
      content: "",
    };
    const updatedBlocks = [...blocks, newBlock];
    setBlocks(updatedBlocks);
    setActiveBlock(newBlock.id);
    onChange?.(updatedBlocks);
  };

  const insertBlockAfter = (afterId: string, type: BlockType) => {
    const index = blocks.findIndex((b) => b.id === afterId);
    const newBlock: ContentBlock = {
      id: generateId(),
      type,
      content: "",
    };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
    setActiveBlock(newBlock.id);
    onChange?.(newBlocks);
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    const newBlocks = blocks.map((b) =>
      b.id === id ? { ...b, ...updates } : b,
    );
    setBlocks(newBlocks);
    onChange?.(newBlocks);
  };

  const removeBlock = (id: string) => {
    if (blocks.length <= 1) return;
    const newBlocks = blocks.filter((b) => b.id !== id);
    setBlocks(newBlocks);
    if (activeBlock === id) setActiveBlock(null);
    onChange?.(newBlocks);
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, moved);
    setBlocks(newBlocks);
    onChange?.(newBlocks);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverRef.current = index;
  };

  const handleDrop = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      moveBlock(draggedIndex, index);
    }
    setDraggedIndex(null);
    dragOverRef.current = null;
  };

  const getBlockIcon = (type: BlockType) => {
    switch (type) {
      case "paragraph":
        return Type;
      case "heading":
        return Heading;
      case "image":
        return ImageIcon;
      case "quote":
        return Quote;
      case "bullet":
        return List;
      case "numbered":
        return ListOrdered;
      default:
        return Type;
    }
  };

  const renderEditor = () => (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Content Editor</h3>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            showPreview
              ? "bg-[#002E5D] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Eye className="w-4 h-4" />
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto max-h-[calc(100vh-400px)]">
        {blocks.map((block, index) => {
          const Icon = getBlockIcon(block.type);
          const isDragging = draggedIndex === index;

          return (
            <div
              key={block.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              className={`group flex items-start gap-2 p-3 bg-white rounded-lg border transition-all ${
                activeBlock === block.id
                  ? "border-[#F58220] ring-1 ring-[#F58220]/20"
                  : "border-gray-200 hover:border-gray-300"
              } ${isDragging ? "opacity-50" : ""}`}
            >
              <button
                onClick={() => setActiveBlock(block.id)}
                className="cursor-grab hover:bg-gray-100 p-1 rounded text-black opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <GripVertical className="w-4 h-4" />
              </button>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const types: BlockType[] = [
                        "paragraph",
                        "heading",
                        "image",
                        "quote",
                        "bullet",
                        "numbered",
                      ];
                      const currentIndex = types.indexOf(block.type);
                      const nextType = types[(currentIndex + 1) % types.length];
                      updateBlock(block.id, { type: nextType });
                    }}
                    className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <Icon className="w-3 h-3" />
                    <span className="capitalize">{block.type}</span>
                  </button>

                  <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => insertBlockAfter(block.id, "paragraph")}
                      className="p-1.5 text-black hover:text-[#F58220] hover:bg-[#F58220]/10 rounded"
                      title="Add block below"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveBlock(index, index - 1)}
                      disabled={index === 0}
                      className="p-1.5 text-black hover:text-[#F58220] hover:bg-[#F58220]/10 rounded disabled:opacity-30"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveBlock(index, index + 1)}
                      disabled={index === blocks.length - 1}
                      className="p-1.5 text-black hover:text-[#F58220] hover:bg-[#F58220]/10 rounded disabled:opacity-30"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeBlock(block.id)}
                      className="p-1.5 text-black hover:text-red-500 hover:bg-red-50 rounded"
                      title="Delete block"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {block.type === "paragraph" && (
                  <textarea
                    value={block.content}
                    onChange={(e) =>
                      updateBlock(block.id, { content: e.target.value })
                    }
                    placeholder="Enter paragraph text..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220] focus:border-transparent resize-none min-h-100px text-gray-900 placeholder:text-black"
                    onFocus={() => setActiveBlock(block.id)}
                  />
                )}

                {block.type === "heading" && (
                  <input
                    type="text"
                    value={block.content}
                    onChange={(e) =>
                      updateBlock(block.id, { content: e.target.value })
                    }
                    placeholder="Enter heading..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220] focus:border-transparent text-lg font-semibold text-gray-900 placeholder:text-black"
                    onFocus={() => setActiveBlock(block.id)}
                  />
                )}

                {block.type === "image" && (
                  <div className="space-y-2">
                    {block.imageUrl ? (
                      <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={block.imageUrl}
                          alt="Featured"
                          fill
                          className="object-cover"
                        />
                        <button
                          onClick={() =>
                            updateBlock(block.id, { imageUrl: "" })
                          }
                          className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg hover:bg-black/70"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#F58220] transition-colors">
                        <Upload className="w-8 h-8 text-black mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-2">
                          Drag and drop an image here
                        </p>
                        <p className="text-xs text-black">or</p>
                        <label className="inline-block mt-2 px-4 py-2 bg-[#002E5D] text-white text-sm rounded-lg cursor-pointer hover:bg-[#001f45]">
                          Browse Files
                          <input
                            type="text"
                            placeholder="Enter image URL..."
                            className="hidden"
                            onChange={(e) =>
                              updateBlock(block.id, {
                                imageUrl: e.target.value,
                              })
                            }
                          />
                        </label>
                        <input
                          type="text"
                          value={block.imageUrl || ""}
                          onChange={(e) =>
                            updateBlock(block.id, { imageUrl: e.target.value })
                          }
                          placeholder="Or enter image URL..."
                          className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220] text-gray-900 placeholder:text-black"
                        />
                      </div>
                    )}
                    <input
                      type="text"
                      value={block.imageCaption || ""}
                      onChange={(e) =>
                        updateBlock(block.id, { imageCaption: e.target.value })
                      }
                      placeholder="Image caption (optional)"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220] text-sm text-gray-900 placeholder:text-black"
                    />
                  </div>
                )}

                {block.type === "quote" && (
                  <div className="flex">
                    <div className="w-1 bg-[#F58220] rounded-full mr-3" />
                    <textarea
                      value={block.content}
                      onChange={(e) =>
                        updateBlock(block.id, { content: e.target.value })
                      }
                      placeholder="Enter quote text..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220] resize-none min-h-80px italic text-gray-900 placeholder:text-black"
                      onFocus={() => setActiveBlock(block.id)}
                    />
                  </div>
                )}

                {block.type === "bullet" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <span className="text-lg">•</span>
                      <input
                        type="text"
                        value={block.content}
                        onChange={(e) =>
                          updateBlock(block.id, { content: e.target.value })
                        }
                        placeholder="Enter list item..."
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220] text-gray-900 placeholder:text-black"
                        onFocus={() => setActiveBlock(block.id)}
                      />
                    </div>
                  </div>
                )}

                {block.type === "numbered" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <span className="font-medium">1.</span>
                      <input
                        type="text"
                        value={block.content}
                        onChange={(e) =>
                          updateBlock(block.id, { content: e.target.value })
                        }
                        placeholder="Enter list item..."
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220] text-gray-900 placeholder:text-black"
                        onFocus={() => setActiveBlock(block.id)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 pt-4 mt-4 border-t border-gray-200">
        <span className="text-sm text-gray-500">Add block:</span>
        <button
          onClick={() => addBlock("paragraph")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
        >
          <Type className="w-4 h-4" />
          Paragraph
        </button>
        <button
          onClick={() => addBlock("heading")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
        >
          <Heading className="w-4 h-4" />
          Heading
        </button>
        <button
          onClick={() => addBlock("image")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
        >
          <ImageIcon className="w-4 h-4" />
          Image
        </button>
        <button
          onClick={() => addBlock("quote")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
        >
          <Quote className="w-4 h-4" />
          Quote
        </button>
        <button
          onClick={() => addBlock("bullet")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
        >
          <List className="w-4 h-4" />
          Bullet
        </button>
        <button
          onClick={() => addBlock("numbered")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
        >
          <ListOrdered className="w-4 h-4" />
          Numbered
        </button>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Live Preview</h3>
        <span className="text-xs text-gray-500">What readers will see</span>
      </div>
      <div className="p-6 max-h-[calc(100vh-400px)] overflow-y-auto">
        {blocks.map((block) => {
          if (block.type === "paragraph" && block.content) {
            return (
              <p key={block.id} className="text-gray-700 leading-relaxed mb-4">
                {block.content}
              </p>
            );
          }
          if (block.type === "heading" && block.content) {
            return (
              <h2
                key={block.id}
                className="text-xl font-bold text-gray-900 mb-4 mt-6"
              >
                {block.content}
              </h2>
            );
          }
          if (block.type === "image" && block.imageUrl) {
            return (
              <figure key={block.id} className="my-6">
                <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={block.imageUrl}
                    alt={block.imageCaption || ""}
                    fill
                    className="object-cover"
                  />
                </div>
                {block.imageCaption && (
                  <figcaption className="text-center text-sm text-gray-500 mt-2">
                    {block.imageCaption}
                  </figcaption>
                )}
              </figure>
            );
          }
          if (block.type === "quote" && block.content) {
            return (
              <blockquote
                key={block.id}
                className="border-l-4 border-[#F58220] pl-4 my-6 italic text-gray-700"
              >
                {block.content}
              </blockquote>
            );
          }
          if (block.type === "bullet" && block.content) {
            return (
              <ul
                key={block.id}
                className="list-disc list-inside space-y-2 my-4 text-gray-700"
              >
                <li className="ml-4">{block.content}</li>
              </ul>
            );
          }
          if (block.type === "numbered" && block.content) {
            return (
              <ol
                key={block.id}
                className="list-decimal list-inside space-y-2 my-4 text-gray-700"
              >
                <li className="ml-4">{block.content}</li>
              </ol>
            );
          }
          return null;
        })}
        {blocks.every((b) => !b.content) && (
          <p className="text-black text-center py-8">
            Start adding content to see preview...
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      {showPreview ? (
        <div className="flex gap-4">
          {renderEditor()}
          {renderPreview()}
        </div>
      ) : (
        renderEditor()
      )}
    </div>
  );
}
