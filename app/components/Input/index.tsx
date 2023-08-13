import TextareaAutosize from "react-textarea-autosize";
import Icon from "../Icon";
import Image from "../Image";

type CommentProps = {
  className?: string;
  avatar?: string;
  placeholder: string;
  value: any;
  setValue: any;
};

const Comment = ({
  className,
  avatar,
  placeholder,
  value,
  setValue,
}: CommentProps) => {
  return (
    <form
      className={`flex pl-1 py-1 pr-5 bg-white border border-n-1 shadow-primary-4 md:pr-4 dark:bg-n-1 dark:border-white ${className}`}
      action=""
      onSubmit={() => console.log("Submit")}
    >
      <TextareaAutosize
        className="grow self-center py-2 px-4 bg-transparent text-sm font-medium text-n-1 outline-none resize-none placeholder:text-n-1 md:px-3 dark:text-white dark:placeholder:text-white"
        maxRows={5}
        autoFocus
        value={value}
        onChange={setValue}
        placeholder={placeholder}
        required
      />
      <div className="flex items-center shrink-0 h-[3.375rem]">
        <button
          className="btn-transparent-dark btn-square btn-small mr-1 md:hidden"
          type="button"
        >
          <Icon name="smile" />
        </button>
        <button
          className="btn-transparent-dark btn-square btn-small mr-3 md:hidden"
          type="button"
        >
          <Icon name="plus" />
        </button>
        <button className="btn-purple btn-square btn-small" type="submit">
          <Icon name="send" />
        </button>
      </div>
    </form>
  );
};

export default Comment;
