import React, {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {Site} from '../Utility/GlobalTypes';

type ActionItemProps = {
  site: Site;
};

const ActionItem: React.FC<ActionItemProps> = ({site}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Type assertion for event.target as Node
      const target = event.target as Node;

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    navigate('edit', {state: {site}});
  };

  const handleArchive = () => {
    // Implement archive logic here
    alert(`Archiving property ${site.siteInfo.siteId}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="text-gray-500 hover:text-gray-700 focus:outline-none">
        ...
      </button>
      {showDropdown && (
        <div className="absolute z-10 -ml-8 text-left bg-white shadow-lg rounded-lg mt-2">
          <ul className="block">
            <li>
              <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 block w-full text-left"
                      onClick={handleEdit}>Edit
              </button>
            </li>
            <li>
              <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 block w-full text-left"
                      onClick={handleArchive}>Archive
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActionItem;
