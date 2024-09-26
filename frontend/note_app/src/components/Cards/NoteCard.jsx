import React from "react";
import { MdOutlinePushPin,MdCreate,MdDelete } from "react-icons/md";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNotes,
}) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex justify-between items-center">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500">{date}</span>
        </div>
        <MdOutlinePushPin
          className={`icon-btn ${isPinned ? `text-primary` : `text-slate-300`}`}
          onClick={onPinNotes}
        />
      </div>
      <p>{content?.slice(0, 150)}</p>

      <div className="flex items-center gap-2 mb-2 justify-between">
        <div className="flex flex-wrap gap-2 text-xs text-slate-500 mt-5">
          {/* Loop through each tag and add spacing between them */}
          {tags?.map((tag, index) => (
            <span key={index} className="bg-slate-200 px-2 py-1 rounded-lg">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <MdCreate
            className="hover:text-green-600 cursor-pointer text-xl"
            onClick={onEdit}
          />
          <MdDelete
            className="hover:text-red-600 cursor-pointer text-xl"
            onClick={onDelete} // Make sure the onDelete is handled here
          />
        </div>
      </div>
    </div>
  );
};


export default NoteCard;
