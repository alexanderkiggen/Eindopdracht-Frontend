// SearchBar.jsx
import "./SearchBar.css";

function SearchBar({ onSubmit }) {
    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const query = formData.get("search");
        if (onSubmit) {
            onSubmit(query);
        }
    }

    return (
        <form className="navbar__search" onSubmit={handleSubmit}>
            <input
                type="text"
                name="search"
                placeholder="Zoeken in Finder"
            />
        </form>
    );
}

export default SearchBar;
