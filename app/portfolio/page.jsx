import  Container  from "./Container"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"

const page = () => {
    return(
        <div>
            <Navbar />
            <Container />
            <Footer />
        </div>
    )
}

export default page