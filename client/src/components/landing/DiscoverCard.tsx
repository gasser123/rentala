import Image from "next/image";

interface Props {
  imageSrc: string;
  title: string;
  description: string;
}
const DiscoverCard = ({ description, imageSrc, title }: Props) => {
  return (
    <div className="px-4 py-12 shadow-lg rounded-lg bg-gray-50 md:h-72">
      <div className="bg-gray-900 p-[0.6rem] rounded-full mb-4 h-10 w-10 mx-auto">
        <Image
          src={imageSrc}
          width={30}
          height={30}
          className="w-full h-full"
          alt="feature image"
        />
      </div>
      <h3 className="mt-4 text-xl font-medium text-gray-900 ">{title}</h3>
      <p className="mt-2 text-base text-gray-500">{description}</p>
    </div>
  );
};

export default DiscoverCard;
