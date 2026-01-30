import React, { useMemo, useRef } from "react";

// Counter for generating unique IDs without special characters
let liquidIdCounter = 0;

/**
 * Props for Liquid component.
 */
export interface LiquidProps {
  children: React.ReactNode;
  /** Blur amount (higher = more merge) */
  blur?: number;
  /** Threshold for alpha clipping (controls edge sharpness) */
  threshold?: number;
  /** Color of the liquid (if solid) */
  color?: string;
  /** Background color (behind the liquid) */
  backgroundColor?: string;
  /** Filter ID (auto-generated if not provided) */
  id?: string;
  /** Additional CSS styles */
  style?: React.CSSProperties;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Creates an organic "gooey" liquid effect for child elements.
 * Elements close to each other will merge and separate organically.
 * 
 * Works by applying a heavy blur followed by a high-contrast alpha threshold.
 * 
 * @example
 * // Merging balls
 * <Liquid blur={20} threshold={18} color="#00ff00">
 *   <Ball x={100} />
 *   <Ball x={150} />
 * </Liquid>
 * 
 * @example
 * // Morphing text
 * <Liquid blur={10}>
 *   <Text>Morph</Text>
 * </Liquid>
 */
export const Liquid: React.FC<LiquidProps> = ({
  children,
  blur = 20,
  threshold = 18, // Contrast boost
  color, // Optional tint
  backgroundColor = "transparent",
  id,
  style,
  className,
}) => {
  // Use ref with counter to generate stable IDs without special characters
  const idRef = useRef<string | null>(null);
  if (idRef.current === null) {
    idRef.current = `liquid-filter-${++liquidIdCounter}`;
  }
  const filterId = useMemo(() => id || idRef.current!, [id]);

  // The gooey effect is achieved by:
  // 1. Blurring the graphics (feGaussianBlur)
  // 2. Increasing alpha contrast to make blurred edges sharp again (feColorMatrix)
  
  // Matrix explanation:
  // R G B A 1
  // 1 0 0 0 0  (Keep Red)
  // 0 1 0 0 0  (Keep Green)
  // 0 0 1 0 0  (Keep Blue)
  // 0 0 0 18 -7 (Multiply Alpha by 18, subtract 7 to clip transparent areas)
  
  const alphaMultiplier = threshold;
  // Offset is tied to multiplier to keep edges crisp as threshold changes.
  const alphaOffset = -(threshold - 1);

  return (
    <div 
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor,
        filter: `url(#${filterId})`,
        overflow: 'visible',
        ...style
      }}
    >
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'visible' }}>
        <defs>
          <filter 
            id={filterId}
            x="-50%" 
            y="-50%" 
            width="200%" 
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            {/* 1. Blur everything */}
            <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
            
            {/* 2. Alpha Threshold / Contrast - creates the gooey edge */}
            <feColorMatrix 
              in="blur" 
              type="matrix" 
              values={`
                1 0 0 0 0  
                0 1 0 0 0  
                0 0 1 0 0  
                0 0 0 ${alphaMultiplier} ${alphaOffset}
              `}
              result="goo" 
            />
            
            {/* 3. (Optional) Tinting - if color provided */}
            {color ? (
              <>
                <feFlood floodColor={color} result="flood" />
                <feComposite in="flood" in2="goo" operator="in" />
              </>
            ) : (
              /* Just output the goo result directly */
              <feComposite in="goo" in2="goo" operator="over" />
            )}
          </filter>
        </defs>
      </svg>
      {children}
    </div>
  );
};

export default Liquid;
