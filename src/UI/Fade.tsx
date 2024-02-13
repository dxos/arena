import { motion } from "framer-motion";
import * as React from "react";

type FadeProps = { children: React.ReactNode };

export const Fade = (props: FadeProps) => (
  <motion.div
    animate={{ opacity: 1 }}
    initial={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
    exit={{ opacity: 0 }}
  >
    {props.children}
  </motion.div>
);
