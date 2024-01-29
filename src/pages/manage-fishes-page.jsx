import { useCallback, useEffect, useState } from "react";
import { getAllFishes } from "../api/fish-api";
import ContentWrapper from "../components/UI/content-wrapper";
import FishItem from "../components/fish/fish-item";
import SearchFish from "../components/fish/search-fish";
import AddFish from "../components/fish/add-fish-modal";
import { getAllTypes } from "../api/type-api";
import FishPagination from "../components/fish/fish-pagination";

export default function ManageFishPage() {
  const [fishes, setFishes] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(fishes.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentFishes = fishes.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  console.log(fishes);

  const fetchFishes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllFishes();
      const types = await getAllTypes();
      setFishes(data.data.reverse());
      setTypes(types.data);
    } catch (error) {
      console.error("Failed to fetch fishes or types:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFishes();
  }, [fetchFishes]);

  const reFetchFishes = () => {
    fetchFishes();
  };

  return (
    <>
      <section id="fish-section" className="section-wrapper">
        <div className="flex flex-wrap justify-between items-center mb-3">
          <button className="bg-rose-500 text-white px-3 py-2.5 rounded-md" onClick={() => setIsOpen(true)}>
            Add Fish
          </button>
          <SearchFish />
        </div>
        <FishPagination totalPages={totalPages} paginate={paginate} currentPage={currentPage} />
        <ContentWrapper loading={loading}>
          {currentFishes.map((fish) => (
            <FishItem key={fish._id} {...fish} reFetchFishes={reFetchFishes} typesData={types} />
          ))}
        </ContentWrapper>
      </section>
      <AddFish isOpen={isOpen} setIsOpen={setIsOpen} types={types} onAdd={reFetchFishes} />
    </>
  );
}
