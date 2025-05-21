import Carousel from "../../components/Carousel.jsx";
import {HomePageSectionContainer} from "../../components/HomePageSectionContainer.jsx";

export const RecommendationSection = () => {
    return (
        <HomePageSectionContainer name='Recommended to you' link='/preferences'>
            <Carousel/>
        </HomePageSectionContainer>
    )
}