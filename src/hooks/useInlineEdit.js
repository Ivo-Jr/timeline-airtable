import { useState, useRef, useEffect } from 'react';

export function useInlineEdit(initialValue, onSave) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingValue, setEditingValue] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    setIsEditing(true);
    setEditingValue(initialValue);
  };

  const saveEdit = () => {
    if (editingValue.trim() && editingValue !== initialValue) {
      onSave(editingValue.trim());
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditingValue(initialValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  const handleInputChange = (e) => {
    setEditingValue(e.target.value);
  };

  const handleBlur = () => {
    saveEdit();
  };

  return {
    isEditing,
    editingValue,
    inputRef,
    startEditing,
    saveEdit,
    cancelEdit,
    handleKeyDown,
    handleInputChange,
    handleBlur
  };
}
