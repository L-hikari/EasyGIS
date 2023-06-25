import {useEffect, useState} from 'react';

export default function Modal({visible: propIsOpen, onClose, title, children, onOk}) {
    const [visible, setVisible] = useState(propIsOpen);

    const openModal = () => {
        setVisible(true);
    };

    const closeModal = () => {
        setVisible(false);
        onClose && onClose();
    };

    // 监听 propIsOpen 变化，用于父组件控制 Modal 显示与隐藏
    useEffect(() => {
        setVisible(propIsOpen);
    }, [propIsOpen]);

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-10 ${
                visible ? 'visible' : 'hidden'
            }`}
        >
            {/* 背景遮罩 */}
            {visible && <div className="fixed inset-0 bg-gray-900 bg-opacity-50"></div>}

            {/* 模态框 */}
            {visible && (
                <div className="fixed bg-white shadow-lg">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold">{title}</h2>
                        <div className="mt-2">{children}</div>
                    </div>
                    <div className="p-4 bg-gray-100">
                        <button onClick={onOk}>
                            确定
                        </button>
                        <button
                            className="px-4 py-2"
                            onClick={closeModal}
                        >
                            关闭
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
