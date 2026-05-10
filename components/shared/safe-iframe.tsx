import { forwardRef, type IframeHTMLAttributes } from "react";

export const SAFE_IFRAME_ALLOW = "autoplay; fullscreen; picture-in-picture; encrypted-media";
export const SAFE_IFRAME_SANDBOX = "allow-scripts allow-same-origin allow-forms allow-presentation";

type SafeIframeProps = IframeHTMLAttributes<HTMLIFrameElement> & {
  title: string;
};

export const SafeIframe = forwardRef<HTMLIFrameElement, SafeIframeProps>(
  function SafeIframe(
    {
      allow = SAFE_IFRAME_ALLOW,
      sandbox = SAFE_IFRAME_SANDBOX,
      referrerPolicy = "no-referrer",
      allowFullScreen = true,
      ...props
    },
    ref,
  ) {
    return (
      <iframe
        ref={ref}
        {...props}
        allow={allow}
        sandbox={sandbox}
        referrerPolicy={referrerPolicy}
        allowFullScreen={allowFullScreen}
      />
    );
  },
);
