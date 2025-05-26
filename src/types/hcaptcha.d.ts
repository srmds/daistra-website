interface Window {
    hcaptcha?: {
        reset: () => void;
        render: (element: HTMLElement, options: any) => void;
    };
} 