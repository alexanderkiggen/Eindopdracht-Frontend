import { useState, useEffect } from 'react';
import './FilterSection.css';

function FilterSection({ selectedGenre, selectedPlatform, selectedFeatures, onFilterChange }) {
    const [openSection, setOpenSection] = useState(() => {
        return localStorage.getItem('openSection');
    });
    const [checkedFeatures, setCheckedFeatures] = useState([]);

    // Default filters: PS5 en Action
    useEffect(() => {
        if (!selectedPlatform) onFilterChange('platform', '187');
        if (!selectedGenre) onFilterChange('genre', 'action');
    }, []);

    useEffect(() => {
        // Filters uit URL halen
        if (selectedFeatures) {
            setCheckedFeatures(selectedFeatures.split(','));
        } else {
            setCheckedFeatures([]);
        }
    }, [selectedFeatures]);

    const toggleSection = (section) => {
        const newSection = openSection === section ? null : section;
        setOpenSection(newSection);
        // Sla op in localStorage (null = niets open)
        if (newSection) {
            localStorage.setItem('openSection', newSection);
        } else {
            localStorage.removeItem('openSection');
        }
    };

    const genres = [
        { label: 'Action', slug: 'action' },
        { label: 'Adventure', slug: 'adventure' },
        { label: 'Arcade', slug: 'arcade' },
        { label: 'Casual', slug: 'casual' },
        { label: 'Indie', slug: 'indie' },
        { label: 'Puzzle', slug: 'puzzle' },
        { label: 'RPG', slug: 'rpg' },
        { label: 'Shooter', slug: 'shooter' },
        { label: 'Simulation', slug: 'simulation' },
        { label: 'Strategy', slug: 'strategy' },
    ];

    const platforms = [
        { id: '4', label: 'PC' },
        { id: '187', label: 'PlayStation 5' },
        { id: '18', label: 'PlayStation 4' },
        { id: '1', label: 'Xbox One' },
        { id: '186', label: 'Xbox Series X/S' }
    ];

    const features = [
        { id: '7', value: 'singleplayer', label: 'Singleplayer' },
        { id: '8', value: 'multiplayer', label: 'Multiplayer' },
        { id: '9', value: 'co-op', label: 'Co-op' }
    ];

    const handleFeatureChange = (featureTag, isChecked) => {
        let newFeatures;

        if (isChecked) {
            newFeatures = [...checkedFeatures, featureTag];
        } else {
            newFeatures = checkedFeatures.filter(f => f !== featureTag);
        }

        setCheckedFeatures(newFeatures);
        onFilterChange('features', newFeatures.length > 0 ? newFeatures.join(',') : '');
    };

    const handlePlatformChange = (platformId, isChecked) => {
        const currentPlatforms = selectedPlatform ? selectedPlatform.split(',') : [];
        let newPlatforms;

        if (isChecked) {
            newPlatforms = [...currentPlatforms, platformId];
        } else {
            newPlatforms = currentPlatforms.filter(p => p !== platformId);
        }

        onFilterChange('platform', newPlatforms.length > 0 ? newPlatforms.join(',') : '');
    };

    return (
        <aside className="filter-section">
            <div className="filter-section__header">
                <h3>Filters ({
                    (selectedGenre ? 1 : 0) +
                    (selectedPlatform ? selectedPlatform.split(',').length : 0) +
                    (checkedFeatures.length)
                })</h3>
            </div>

            {/* Genre Filter */}
            <div className="filter-group">
                <button
                    className="filter-group__header"
                    onClick={() => toggleSection('genre')}
                >
                    <span>Genre</span>
                    <span className="filter-group__icon">
                        {openSection === 'genre' ? '▼' : '▶'}
                    </span>
                </button>
                {openSection === 'genre' && (
                    <div className="filter-group__content">
                        {genres.map((genre) => (
                            <label key={genre.slug} className="filter-checkbox">
                                <input
                                    type="radio"
                                    name="genre"
                                    value={genre.slug}
                                    checked={selectedGenre === genre.slug}
                                    onChange={(e) => onFilterChange('genre', e.target.value)}
                                />
                                <span>{genre.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Platform Filter */}
            <div className="filter-group">
                <button
                    className="filter-group__header"
                    onClick={() => toggleSection('platform')}
                >
                    <span>Platform</span>
                    <span className="filter-group__icon">
                        {openSection === 'platform' ? '▼' : '▶'}
                    </span>
                </button>
                {openSection === 'platform' && (
                    <div className="filter-group__content">
                        {platforms.map((platform) => {
                            const currentPlatforms = selectedPlatform ? selectedPlatform.split(',') : [];
                            return (
                                <label key={platform.id} className="filter-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={currentPlatforms.includes(platform.id)}
                                        onChange={(e) => handlePlatformChange(platform.id, e.target.checked)}
                                    />
                                    <span>{platform.label}</span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Kenmerken Filter */}
            <div className="filter-group">
                <button
                    className="filter-group__header"
                    onClick={() => toggleSection('features')}
                >
                    <span>Kenmerken</span>
                    <span className="filter-group__icon">
                        {openSection === 'features' ? '▼' : '▶'}
                    </span>
                </button>
                {openSection === 'features' && (
                    <div className="filter-group__content">
                        {features.map((feature) => (
                            <label key={feature.value} className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={checkedFeatures.includes(feature.id)}
                                    onChange={(e) => handleFeatureChange(feature.id, e.target.checked)}
                                />
                                <span>{feature.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
}

export default FilterSection;
