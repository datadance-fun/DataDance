import { API, BlockAPI } from "@editorjs/editorjs";
import { throttle } from "lodash";
import { useEffect, useState } from "react";

export function useBlockFocus(api: API, thisBlock: BlockAPI) {
  const [isFocus, setFocus] = useState(false);

  useEffect(() => {
    const handleMutated = throttle(() => {
      const idx = api.blocks.getCurrentBlockIndex();
      if (idx === -1) {
        return;
      }
      const block = api.blocks.getBlockByIndex(idx) as BlockAPI;
      const activeBlockId = block.id;
      setFocus(activeBlockId === thisBlock.id);
    }, 100);
    const mo = new MutationObserver(handleMutated);
    mo.observe(thisBlock.holder, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => mo.disconnect();
  }, []);

  return isFocus;
}
