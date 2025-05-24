import Carousel from "../../components/Carousel.jsx";
import {HomePageSectionContainer} from "../../components/HomePageSectionContainer.jsx";

export const RecommendationSection = () => {
    return (
        <HomePageSectionContainer name='Рекомендовано вам' link='/preferences'>
            <Carousel/>
        </HomePageSectionContainer>
    )
}