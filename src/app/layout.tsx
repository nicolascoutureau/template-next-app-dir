import "../styles/global.css";
import { Metadata, Viewport } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Remotion and Next.js",
  description: "Remotion and Next.js",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Element selector for builder preview - only active when in iframe
const elementSelectorScript = `
(function() {
  if (window.parent === window) return;
  
  var selectionMode = false, overlay = null, highlightBox = null, currentElement = null;
  
  function getPlayerContainer() {
    return document.querySelector('[style*="--remotion"]') || 
           document.querySelector('.remotion-player') ||
           document.querySelector('[data-remotion-player-container]');
  }
  
  function isInsidePlayer(el) {
    var player = getPlayerContainer();
    return player ? player.contains(el) : false;
  }
  
  function getReactName(el) {
    var key = Object.keys(el).find(function(k) { return k.startsWith('__reactFiber$'); });
    if (!key) return null;
    try {
      var fiber = el[key];
      while (fiber) {
        if (fiber.type && typeof fiber.type === 'function') {
          var name = fiber.type.displayName || fiber.type.name;
          if (name && name !== 'Anonymous') return name;
        }
        fiber = fiber.return;
      }
    } catch (e) {}
    return null;
  }
  
  function capture(el) {
    var rect = el.getBoundingClientRect();
    var styles = window.getComputedStyle(el);
    return {
      tagName: el.tagName, id: el.id || undefined, classes: el.className || '',
      styles: { color: styles.color, backgroundColor: styles.backgroundColor, fontSize: styles.fontSize },
      outerHTML: el.outerHTML.slice(0, 500), componentName: getReactName(el),
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      textContent: (el.textContent || '').trim().slice(0, 200)
    };
  }
  
  function createOverlay() {
    overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:999999;cursor:crosshair;';
    highlightBox = document.createElement('div');
    highlightBox.style.cssText = 'position:fixed;border:2px solid #f59e0b;background:rgba(245,158,11,0.1);pointer-events:none;z-index:999998;display:none;';
    document.body.appendChild(overlay);
    document.body.appendChild(highlightBox);
    
    overlay.addEventListener('mousemove', function(e) {
      overlay.style.pointerEvents = 'none';
      var el = document.elementFromPoint(e.clientX, e.clientY);
      overlay.style.pointerEvents = 'auto';
      if (el && el !== overlay && el !== highlightBox && isInsidePlayer(el)) {
        currentElement = el;
        var rect = el.getBoundingClientRect();
        highlightBox.style.display = 'block';
        highlightBox.style.left = rect.left + 'px';
        highlightBox.style.top = rect.top + 'px';
        highlightBox.style.width = rect.width + 'px';
        highlightBox.style.height = rect.height + 'px';
      } else {
        highlightBox.style.display = 'none';
        currentElement = null;
      }
    });
    
    overlay.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (currentElement) {
        window.parent.postMessage({ type: 'element-selected', element: capture(currentElement) }, '*');
        disable();
      }
    });
    
    document.addEventListener('keydown', onKey);
  }
  
  function onKey(e) {
    if (e.key === 'Escape' && selectionMode) {
      window.parent.postMessage({ type: 'selection-cancelled' }, '*');
      disable();
    }
  }
  
  function enable() {
    if (!selectionMode) { selectionMode = true; createOverlay(); }
  }
  
  function disable() {
    selectionMode = false;
    if (overlay) { overlay.remove(); overlay = null; }
    if (highlightBox) { highlightBox.remove(); highlightBox = null; }
    document.removeEventListener('keydown', onKey);
    currentElement = null;
  }
  
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'enable-selection') enable();
    else if (e.data && e.data.type === 'disable-selection') disable();
  });
  
  window.parent.postMessage({ type: 'selection-ready' }, '*');
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
        {/* DO NOT REMOVE: Element selector for builder preview */}
        <Script
          id="element-selector"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: elementSelectorScript }}
        />
      </body>
    </html>
  );
}
