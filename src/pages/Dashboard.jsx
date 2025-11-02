import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { loadDashboard } from "../store/actions/board.actions"

import { BarChart } from "../cmps/Charts/BarChart"
import { CustomPieChart } from "../cmps/Charts/CustomPieChart"
import { showErrorMsg } from "../services/event-bus.service"

import { SvgIcon } from "../cmps/SvgIcon"
import { PieChart } from "../cmps/Charts/PieChart"

export function Dashboard(props) {

    const dashboardData = useSelector(storeState => storeState.boardModule.dashboardData)
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        onLoadDashboard()
    }, [boards])

    async function onLoadDashboard() {
        setIsLoading(true)
        try {
            await loadDashboard()
        } catch (err) {
            showErrorMsg('faild to load dashboard')
        } finally {
            setTimeout(() => {
                setIsLoading(false)
            }, 200);
        }
    }


    return (
        <section className="dashboard">

            <header className="dashboard-header">
                <div className="dashboard-name-container">
                    <h1>Dashboard</h1>
                </div>

                <nav className="dashboard-nav">

                    {!isLoading
                        ? <div className="dashboard-nav-btns flex align-center">
                            <button className="blue flex align-center">
                                <SvgIcon iconName="plus" size={20} colorName="whiteText" />
                                <span> Add widget</span>
                            </button>
                            <button className="flex align-center">
                                <SvgIcon iconName="board" size={20} />
                                <span>{boards?.length} connected boards</span>
                            </button>
                        </div>

                        : <div className="dashboard-nav-btns flex align-center">
                            <div className="shimmer-block btn-size"></div>
                            <div className="shimmer-block btn-size"></div>
                        </div>
                    }
                </nav>

                {isLoading && <div className="blue-loader"></div>}
            </header>



            < section className="dashboard-content">
                {!isLoading && dashboardData?.tasksCount ?
                    <>
                        <ul className="data-list small">

                            <li className="data-item">
                                <header className="data-header">
                                    All Tasks
                                </header>
                                <div className="data-content">
                                    <div className="item-count">
                                        {dashboardData?.tasksCount}
                                    </div>
                                </div>
                            </li>

                            {dashboardData &&
                                dashboardData?.byStatus.map(status => {
                                    if (status.id === 'default') return
                                    return < li className="data-item" key={status.id}>
                                        <header className="data-header text-overflow">
                                            {status?.txt}
                                        </header>
                                        <div className="data-content">
                                            <div className="item-count">
                                                {status?.tasksCount}
                                            </div>
                                        </div>
                                    </li>
                                })
                            }
                        </ul>
                        <ul className="data-list big">

                            <li className="data-item big">
                                <header className="data-header flex  text-overflow">
                                    <span className="data-title">Tasks by status</span>
                                </header>
                                <div className="data-content pei">
                                    {dashboardData ? (
                                        <CustomPieChart
                                            data={dashboardData}
                                        />
                                    ) : (
                                        <p>Loading chart...</p>
                                    )}

                                </div>
                            </li>

                            <li className="data-item big">
                                <header className="data-header flex  text-overflow">
                                    <span className="data-title">Tasks by Owner</span>
                                </header>
                                <div className="data-content bar">
                                    {dashboardData ? (
                                        <BarChart
                                            data={dashboardData}
                                        />
                                    ) : (
                                        <p>Loading chart...</p>
                                    )}
                                </div>
                            </li>
                        </ul>
                    </>

                    : <>
                        <ul className="data-list small">
                            {Array.from({ length: 4 }).map((_, idx) => {
                                return <li className="data-item loader" key={idx}>
                                    <header className="data-header"></header>
                                    <div className="data-content shimmer">
                                        <div className="item-count"></div>
                                    </div>
                                </li>
                            })}
                        </ul>
                        <ul className="data-list big">
                            {Array.from({ length: 2 }).map((_, idx) => {
                                return <li className="data-item big loader" key={idx}>
                                    <header className="data-header"></header>
                                    <div className="data-content shimmer">
                                        <div className="item-count"></div>
                                    </div>
                                </li>
                            })}
                        </ul>
                    </>
                }
            </section>

        </section >
    )

}