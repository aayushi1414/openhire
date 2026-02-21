import type { Metadata } from "next";
import Image from "next/image";
import Call from "@/components/call";
import { getInterviewById } from "@/lib/data/interviews";

type Props = {
  params: Promise<{
    interviewId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { interviewId } = await params;
  const interview = await getInterviewById(interviewId);

  return {
    title: interview?.name ?? "OpenHire Client",
  };
}

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
    <div className="absolute top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white md:w-[80%]">
      <div className="h-[88vh] content-center rounded-lg border-2 border-black border-r-4 border-b-4 font-bold transition-all md:block dark:border-white">
        <div className="my-auto flex flex-col items-center justify-center">
          <Image src={image} alt="Graphic" width={200} height={200} className="mb-4" />
          <h1 className="mb-2 font-medium text-md">{title}</h1>
          <p>{description}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-row justify-center align-middle">
        <div className="mr-2 text-center font-semibold text-md">
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
      <div className="form-container mx-auto hidden p-8 md:block">
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
      <div className="my-auto flex flex-col items-center justify-center md:hidden md:h-[0px]">
        <div className="mt-48 px-3">
          <p className="my-5 text-center font-semibold text-md">{interview?.name}</p>
          <p className="my-5 text-center text-gray-600">
            Please use a PC to respond to the interview. Apologies for any inconvenience caused.{" "}
          </p>
        </div>
        <div className="my-5 mr-2 text-center font-semibold text-md">
          Powered by{" "}
          <span className="font-bold">
            Open<span className="text-indigo-600">Hire</span>
          </span>
        </div>
      </div>
    </div>
  );
}
