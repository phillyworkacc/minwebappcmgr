'use client'
import { createContext, useCallback, useContext, useState } from "react";
import { Modal } from "./Modal";
import Spacing from "../Spacing/Spacing";
import { AnimatePresence, motion } from "framer-motion";

type ModalConfig = {
	id: string;
	content: React.ReactNode;
	onClose?: () => void;
};

type ModalContextType = {
	showModal: (config: Omit<ModalConfig, "id">) => void;
	close: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
	const ctx = useContext(ModalContext);
	if (!ctx) throw new Error("ModalProvider is missing");
	return ctx;
};

function generateUUIDv4() {
	// UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : (r & 0x3 | 0x8); // y is 8, 9, A, or B
		return v.toString(16);
	});
}


export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  	const [modal, setModal] = useState<ModalConfig | null>(null);

	const showModal = useCallback((config: Omit<ModalConfig, "id">) => {
		const id = generateUUIDv4();
		setModal({ ...config, id });
	}, []);

	const close =  useCallback(() => setModal(null), []);

	return (
		<ModalContext.Provider value={{ showModal, close }}>
			{children}
			<AnimatePresence>
				{modal !== null && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2, ease: "easeIn" }}
					>
						<Modal onClose={close}>{modal.content}</Modal>
					</motion.div>
				)}
			</AnimatePresence>
		</ModalContext.Provider>
	);
};
