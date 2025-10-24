import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Contact, Mail, Pen } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "../hooks/useGetAppliedJobs";

//const skills = ["HTML", "CSS", "JavaScript", "Reactjs"];
const isResume = true;

const Profile = () => {
  useGetAppliedJobs()
  const [open, setOpen] = useState(false);
  const { User } = useSelector((store) => store.auth);

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8 ">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={User?.profile?.profilePhoto} />
            </Avatar>
            <div>
              <h1 className="font-medium text-xl">{User?.fullname}</h1>
              <p>{User?.profile?.bio}</p>
            </div>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="text-right"
            variant="outline"
          >
            <Pen />
          </Button>
        </div>
        <div className="my-5">
          <div className="flex items-center gap-3 my-2">
            <Mail />
            <span>{User?.email}</span>{" "}
            {/*   ?. (optional chaining) → Safely access a property only if the object exists. If User is undefined or null, it won’t throw an error — just returns undefined. */}
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact />
            <span>{User?.phoneNumber}</span>
          </div>
        </div>
        <div className="my-5">
          <h1 className="text-md font-bold">skills</h1>
          <div className="flex items-center gap-1">
            {
              User?.profile?.skills.length !== 0 ? (
              User?.profile?.skills.map((item, index) => (
                <Badge
                  className="bg-gray-800 text-white rounded-full px-3 py-1"
                  key={index}
                >
                  {item}
                </Badge>
              ))
            ) : (
              <span>NA</span>
            )}
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="text-md font-bold">Resume</Label>
          {
            isResume ? (<a target="_blank" href={User?.profile?.resume} className="text-blue-500 w-full hover:underline cursor-pointer">{User?.profile?.resumeOriginalName || "Resume"}</a>) : (<span>NA</span>)
          }
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl">
        <h1 className="font-bold text-lg my-5">Applied Jobs</h1>
        <AppliedJobTable />
      </div>
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
