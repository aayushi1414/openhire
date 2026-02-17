import Call from "@/components/call";
import { getInterviewById } from "@/services/interviews.service";
import Image from "next/image";

type Props = {
  params: Promise<{
    interviewId: string;
  }>;
};

function PopUpMessage({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) {
  return (
    <div className="bg-white rounded-md absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 md:w-[80%] w-[90%]">
      <div className="h-[88vh] content-center rounded-lg border-2 border-b-4 border-r-4 border-black font-bold transition-all  md:block dark:border-white ">
        <div className="flex flex-col items-center justify-center my-auto">
          <Image src={image} alt="Graphic" width={200} height={200} className="mb-4" />
          <h1 className="text-md font-medium mb-2">{title}</h1>
          <p>{description}</p>
        </div>
      </div>
      <div className="flex flex-row justify-center align-middle mt-3">
        <div className="text-center text-md font-semibold mr-2">
          Powered by{" "}
          <span className="font-bold">
            Open<span className="text-indigo-600">Hire</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default async function InterviewInterface({ params }: Props) {
  const { interviewId } = await params;
  const interview = await getInterviewById(interviewId);

  return (
    <div>
      <div className="hidden md:block p-8 mx-auto form-container">
        {!interview ? (
          <PopUpMessage
            title="Invalid URL"
            description="The interview link you're trying to access is invalid. Please check the URL and try again."
            image="/invalid-url.png"
          />
        ) : !interview.isActive ? (
          <PopUpMessage
            title="Interview Is Unavailable"
            description="We are not currently accepting responses. Please contact the sender for more information."
            image="/closed.png"
          />
        ) : (
          <Call interview={interview as any} />
        )}
      </div>
      <div className=" md:hidden flex flex-col items-center md:h-[0px] justify-center  my-auto">
        <div className="mt-48 px-3">
          <p className="text-center my-5 text-md font-semibold">{interview?.name}</p>
          <p className="text-center text-gray-600 my-5">
            Please use a PC to respond to the interview. Apologies for any inconvenience caused.{" "}
          </p>
        </div>
        <div className="text-center text-md font-semibold mr-2 my-5">
          Powered by{" "}
          <span className="font-bold">
            Open<span className="text-indigo-600">Hire</span>
          </span>
        </div>
      </div>
    </div>
  );
}
