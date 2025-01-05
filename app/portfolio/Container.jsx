import PortfolioChart from "./PortfolioChart";
import PortfolioTable from "./PortfolioTable";


const Container = () => {
    return(
        <div className="flex flex-col lg:flex-row mb-10 pb-7 justify-center align-center">
          <PortfolioChart />
          <PortfolioTable />
        </div>
    )
}

export default Container;