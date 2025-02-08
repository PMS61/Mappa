const CreateFileModal = ({ isOpen, onClose, onSubmit }) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const fileName = e.target.fileName.value;
        if (fileName.trim()) {
            onSubmit(fileName);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Create New File
                </h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="fileName"
                        placeholder="Enter file name"
                        className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        autoFocus
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFileModal;
