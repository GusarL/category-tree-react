import React, { useState, useEffect } from 'react';

type Category = {
    id: string;
    name: string;
    children: Category[];
    expanded: boolean;
};

const loadFromLocalStorage = (): Category[] => {
    const data = window.localStorage.getItem('categoryTree');
    return data ? JSON.parse(data) : [];
};

const CategoryTree: React.FC = () => {
    const [tree, setTree] = useState<Category[]>(() => loadFromLocalStorage());

    useEffect(() => {
        saveToLocalStorage(tree);
    }, [tree]);

    const generateId = (): string => '_' + Math.random().toString(36).substr(2, 9);

    const saveToLocalStorage = (tree: Category[]) => {
        window.localStorage.setItem('categoryTree', JSON.stringify(tree));
    };

    const renderCategory = (category: Category) => (
        <div key={category.id} className="category">
            <button onClick={() => toggleExpand(category.id)}>{category.name}
            </button>
            <span className="buttons">
                <button onClick={() => addSubcategory(category.id)}>Add</button>
                <button onClick={() => renameCategory(category.id)}>Rename</button>
                <button onClick={() => deleteCategory(category.id)}>Delete</button>
            </span>
            {category.expanded && (
                <div className="children">
                    {category.children.map(renderCategory)}
                </div>
            )}
        </div>
    );

    const addSubcategory = (parentId: string) => {
        const name = prompt('Enter subcategory name:');
        if (name) {
            const newCategory: Category = {
                id: generateId(),
                name,
                children: [],
                expanded: true,
            };
            setTree((prevTree) => {
                const updatedTree = [...prevTree];
                const parentCategory = findCategory(updatedTree, parentId);
                if (parentCategory) {
                    const categoryExists = parentCategory.children.find(item => item.id === newCategory.id);
                    if (categoryExists) {
                        return updatedTree;
                    }
                    parentCategory.children.push(newCategory);
                    parentCategory.expanded = true;
                } else if (!parentId) {
                    updatedTree.push(newCategory); // Add root category
                }
                return updatedTree;
            });
        }
    };

    const renameCategory = (id: string) => {
        const newName = prompt('Enter new category name:');
        if (newName) {
            setTree((prevTree) => {
                const updatedTree = [...prevTree];
                const category = findCategory(updatedTree, id);
                if (category) {
                    category.name = newName;
                }
                return updatedTree;
            });
        }
    };

    const deleteCategory = (id: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this category and all its subcategories?');
        if (confirmDelete) {
            setTree((prevTree) => deleteCategoryRecursive([...prevTree], id));
        }
    };

    const deleteCategoryRecursive = (categories: Category[], id: string): Category[] => {
        return categories.filter((category) => {
            if (category.id === id) {
                return false;
            }
            category.children = deleteCategoryRecursive(category.children, id);
            return true;
        });
    };

    const toggleExpand = (id: string) => {
        setTree((prevTree) => {
            const updatedTree = [...prevTree];
            const category = findCategory(updatedTree, id);
            if (category) {
                category.expanded = !category.expanded;
            }
            return updatedTree;
        });
    };

    const findCategory = (categories: Category[], id: string): Category | null => {
        for (const category of categories) {
            if (category.id === id) {
                return category;
            }
            const found = findCategory(category.children, id);
            if (found) {
                return found;
            }
        }
        return null;
    };

    return (
        <div>
            <button onClick={() => addSubcategory('')}>Add Root Category</button>
            {tree.map(renderCategory)}
        </div>
    );
};

export default CategoryTree;



