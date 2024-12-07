// src/components/ui/Dialog.tsx

'use client';

import React, {
  useState,
  useContext,
  createContext,
  ReactNode,
  FC,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
  ReactElement,
  JSXElementConstructor,
} from 'react';
import { cn } from '@/lib/utils';

type DialogProps = {
  children: ReactNode;
  open?: boolean; // 제어된 모드를 위한 open prop
  onOpenChange?: (open: boolean) => void; // open 상태 변경을 위한 콜백
};

type DialogContextType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

type DialogComponent = FC<DialogProps> & {
  Trigger: FC<DialogTriggerProps>;
  Content: FC<DialogContentProps>;
  Header: FC<DialogHeaderProps>;
  Title: FC<DialogTitleProps>;
};

interface DialogTriggerProps {
  asChild?: boolean;
  children: ReactElement<any, string | JSXElementConstructor<any>>;
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  className?: string;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

const Dialog: DialogComponent = ({ children, open: controlledOpen, onOpenChange, ...props }) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen: Dispatch<SetStateAction<boolean>> = (value) => {
    if (isControlled) {
      if (typeof value === 'function') {
        onOpenChange && onOpenChange(value(open));
      } else {
        onOpenChange && onOpenChange(value);
      }
    } else {
      setUncontrolledOpen(value);
    }
  };

  const contextValue: DialogContextType = { open, setOpen };

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger: FC<DialogTriggerProps> = ({ asChild = false, children, ...props }) => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog.Trigger must be used within Dialog');
  }

  const { setOpen } = context;

  const handleClick = () => setOpen(true);

  if (asChild) {
    // Clone the child and pass onClick, avoid spreading other props to prevent type mismatches
    return React.cloneElement(children, { onClick: handleClick });
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

const DialogContent: FC<DialogContentProps> = ({ children, className, ...props }) => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog.Content must be used within Dialog');
  }

  const { open, setOpen } = context;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div className={cn('fixed inset-0 flex items-center justify-center bg-black bg-opacity-50', className)} {...props}>
      <div ref={ref} className="bg-white rounded-lg p-6 shadow-lg">
        {children}
        <button onClick={() => setOpen(false)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
          닫기
        </button>
      </div>
    </div>
  );
};

const DialogHeader: FC<DialogHeaderProps> = ({ children, className, ...props }) => (
  <div className={cn('mb-4', className)} {...props}>
    {children}
  </div>
);

const DialogTitle: FC<DialogTitleProps> = ({ children, className, ...props }) => (
  <h2 className={cn('text-2xl font-bold', className)} {...props}>
    {children}
  </h2>
);

// Assign sub-components to the main Dialog component
Dialog.Trigger = DialogTrigger;
Dialog.Content = DialogContent;
Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;

export default Dialog;
