import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import Container from "./Container"

const page = () => {
    return(
        <div className="min-h-screen ">
            <Navbar />
            <Container />
            <Footer />
        </div>
    )
}

export default page