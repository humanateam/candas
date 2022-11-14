import { For, Resource, Show } from "solid-js"
import { RouteDataArgs, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import api from "~/lib/api"

type assignment = [{
    due_at: string,
    name: string,
    points_possible: number,
    position: number
}]

export function routeData({params}: RouteDataArgs) {
    const assignments = "createServerData$(async () => await api(`courses/${useParams().id}/assignments`))"
    const assignmentsGroups: Resource<[{
        name: string,
        assignments: assignment
    }]> = createServerData$(async ([id]) => await api(`courses/${id}/assignment_groups?include[]=assignments`),{
        key: () => [params.id]
    })
    return { assignments, assignmentsGroups }
}

function AssignmentTable(props: {
    assignments: assignment
}) {
    return <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Possible</th>
                {/*<th>Grade</th>*/}
                <th>Due</th>
            </tr>
        </thead>
        <tbody>
            <For each={props.assignments.sort((a, b) => b.position - a.position)}>
                {assignment => <tr style={{
                    color: (() => {
                        if (new Date(assignment.due_at).getTime() > new Date().getTime()) return "green"
                    })()
                }}>
                    <td>{assignment.name}</td>
                    <td>{assignment.points_possible}</td>
                    <td>{(new Date(assignment.due_at)).toLocaleDateString()}</td>
                </tr>}
            </For>
        </tbody>
    </table>
}

export default function Assignments() {
    const { assignmentsGroups } = useRouteData<typeof routeData>()

    return <>
        <For each={assignmentsGroups()}>
            {group => <Show when={group.assignments.length > 0}>
                <details open>
                    <summary>{group.name}</summary>
                    <AssignmentTable assignments={group.assignments} />
                </details>
            </Show>}
        </For>
        {/*<AssignmentTable assignments={assignments()}/>*/}
    </>
}