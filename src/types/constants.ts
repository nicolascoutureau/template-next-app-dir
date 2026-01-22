import { z } from "zod";

// Generic composition props schema
// Extend this schema based on your composition requirements
export const CompositionProps = z.record(z.string(), z.unknown());

export type CompositionPropsType = z.infer<typeof CompositionProps>;
