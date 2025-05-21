import {useBookStore} from "../store/useBookStore.js";
import {useEffect} from "react";
import { Loader} from "lucide-react";
import {RecentBooksSection, RecommendationSection,CatalogCTASection} from "../sections/homepage";


const Catalog = () => {
  const { getBooks, isBooksLoading} = useBookStore();

  useEffect(() => {
    getBooks()
  }, [getBooks]);


  if (isBooksLoading)
    return (
        <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin" />
        </div>
    );
  return (

      <div className="min-h-screen flex flex-col gap-8 items-center p-6 sm:p-12">
        <RecommendationSection/>
        <RecentBooksSection/>
        <CatalogCTASection/>

      </div>
  )
}


export default Catalog;