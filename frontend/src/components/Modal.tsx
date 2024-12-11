import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export enum proptype {
  create,
  join,
}
export function DialogDemo({ type }: { type: proptype }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          {type === proptype.create ? "Create" : "Join"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === proptype.create ? "Create" : "Join"} Room
          </DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {/* Form moved inside DialogContent */}
        <form
          className="grid gap-4 py-4"
          onSubmit={(event) => {
            event.preventDefault(); // Prevent default reload
            console.log("You have successfully submitted the form.");
          }}
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Room Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              placeholder="Enter room name"
            />
          </div>
          <DialogFooter>
            <Button variant={"default"} size="default" type="submit">
              {type === proptype.create ? "Create" : "Join"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
