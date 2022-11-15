import { createShortcut } from "@solid-primitives/keyboard";
import { createEffect, createSignal, onCleanup } from "solid-js";

const [active, setActive] = createSignal(0)
let goal;
createShortcut(['ArrowDown'], () => setActive(active() + 1))
createShortcut(['ArrowUp'], () => setActive(active() - 1))
let trs = []
export default function Tr(props: {
    children: any
    goal: () => void
}) {
    const i = trs[trs.length - 1] + 1 || 0
    trs.push(i)

    onCleanup(() => {
        trs = trs.filter(e => e != i)
    })
    createEffect(() => {
        if (trs[active()] == i) createShortcut(['Enter'], () => props.goal())
    })

    return <tr class={`${trs[active()] == i ? 'focused' : ''}`}>
        {props.children}
    </tr>
}