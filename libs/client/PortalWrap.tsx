import React, { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalWrapProps {
  children: React.ReactNode;
  wrapperId: string;
}

function createPortalWrapperAndApeend(wrapperId: string) {
  const wrapperElement = document.createElement('div');
  wrapperElement.setAttribute('id', wrapperId);
  document.body.appendChild(wrapperElement);
  return wrapperElement;
}

function PortalWrap({ children, wrapperId }: PortalWrapProps) {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(
    null,
  );

  useLayoutEffect(() => {
    let portalElement = document.getElementById(wrapperId);
    let isWrapperCreated = false;

    if (!portalElement) {
      isWrapperCreated = true;
      portalElement = createPortalWrapperAndApeend(wrapperId);
    }

    setWrapperElement(portalElement);

    return () => {
      if (isWrapperCreated && portalElement?.parentNode) {
        portalElement.parentNode.removeChild(portalElement);
        portalElement.remove();
      }
    };
  }, [wrapperId]);

  if (wrapperElement === null) return null;

  return createPortal(children, wrapperElement);
}

export default PortalWrap;
