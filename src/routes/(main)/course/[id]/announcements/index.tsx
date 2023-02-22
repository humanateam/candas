import { useNavigate, useParams } from "@solidjs/router"
import { For } from "solid-js"
import { A, Title } from "solid-start"
import createFilteredView from "~/components/searchbar"
import Table, { TableContext } from "~/components/table"
import Tr from "~/components/tr"
import { useCourse } from "~/routes/(main)"
import { useAnnouncements } from "../announcements"

export default function Announcements() {
    const { findCourse } = useCourse()
    const navigate = useNavigate()
    const unfilteredAnnouncements = useAnnouncements()
    const params = useParams()

    const [Searchbar, announcements] = createFilteredView(unfilteredAnnouncements, (announcement, search) => {
        if (announcement.title.includes(search())) return [announcement]
        else return []
    }, 'announcements')

    return <>
        <Title>Announcements for {findCourse(params.id).name}</Title>
        {Searchbar}
        <Table headers={['Title', 'Date']}>
            <TableContext>
                <For each={announcements()}>
                    {announcement => <Tr goal={() => navigate(`../announcements/${announcement.id}`)}>
                        <td><A href={`../announcements/${announcement.id}`}>{announcement.title}</A></td>
                        <td>{(new Date(announcement.posted_at)).toLocaleDateString()}</td>
                    </Tr>}
                </For>
            </TableContext>
        </Table>
    </>
}