---
"@ductmofficial/sen-ui": minor
---

Add `Dialog`, `DialogTrigger` and `DialogActions`, built on React Aria Components. `DialogTrigger` takes the trigger (such as `Button`) and the `Dialog` it opens. The modal traps focus, moves focus inside when it opens and back to the trigger when it closes, closes on Escape and on an outside click (`isDismissable`, on by default), hides the rest of the page from assistive technology, and blocks scrolling. `title` names the dialog; `children` can be a function that receives `{ close }`. Use `role="alertdialog"` for confirmations, and `isOpen` / `onOpenChange` to control a dialog without a trigger.
