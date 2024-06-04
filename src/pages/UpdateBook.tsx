import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { updateBook } from "@/http/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(0, {
    message: "Title must be at least 2 characters.",
  }),
  genre: z.string().min(0, {
    message: "Genre must be at least 2 characters.",
  }),
  price: z
    .preprocess(
      (value) => parseFloat(value as string),
      z.number().positive({ message: "Price must be a positive number." })
    )
    .refine((value) => Number.isFinite(value), {
      message: "Price must be a valid number.",
    }),
  description: z.string().min(0, {
    message: "Description must be at least 2 characters.",
  }),
  coverImage: z.instanceof(FileList).refine((file) => {
    return file.length == 0 || file.length === 1;
  }, "Cover Image is required"),
  file: z.instanceof(FileList).refine((file) => {
    return file.length == 0 || file.length === 1;
  }, "Book PDF is required"),
});

const UpdateBook = () => {
  // State to store the image preview URL
  const [coverImagePreview, setCoverImagePreview] = useState("");

  // Function to handle cover image change
  const handleCoverImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    // Check if file is selected
    if (file) {
      // Read the file as a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        // Set the preview URL
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // If no file selected, clear the preview
      setCoverImagePreview("");
    }
  };

  // Rest of your component code...
  const { state: book } = useLocation();

  console.log(book.book.title);

  const { _id } = useParams();
  const navigate = useNavigate();

  if (!_id) {
    return <div>Error: No book ID provided</div>;
  }

  console.log(_id);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: book.book.title,
      genre: book.book.genre,
      price: book.book.price,
      description: book.book.description,
    },
  });

  const coverImageRef = form.register("coverImage");
  const fileRef = form.register("file");

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const queryClient = useQueryClient();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const mutation = useMutation({
    mutationFn: (formdata: FormData) => updateBook(_id, formdata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      console.log("Book created successfully");
      navigate("/dashboard/books");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const formdata = new FormData();
    formdata.append("title", values.title);
    formdata.append("genre", values.genre);
    formdata.append("price", values.price.toString());
    formdata.append("description", values.description);
    formdata.append("coverImage", values.coverImage[0]);
    formdata.append("file", values.file[0]);

    mutation.mutate(formdata);

    console.log(values);
  }

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/books">Books</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Update</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-4">
              <Link to="/dashboard/books">
                <Button variant={"outline"}>
                  <span className="ml-2">Cancel</span>
                </Button>
              </Link>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && (
                  <LoaderCircle className="animate-spin" />
                )}
                <span className="ml-2">Update</span>
              </Button>
            </div>
          </div>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Update a book</CardTitle>
              <CardDescription>
                Fill out the form below to update a book.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4 ">
                  <div className="">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              className="w-full"
                              {...field}
                              placeholder="Book Title here"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="">
                    <FormField
                      control={form.control}
                      name="genre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Genre</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              className="w-full"
                              {...field}
                              placeholder="Book Genre here"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              className="w-full"
                              {...field}
                              placeholder="Price in USD$"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-32"
                          {...field}
                          placeholder=" Book Description here"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 items-center lg:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={() => (
                      <FormItem>
                        <FormLabel>Cover Image</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-6">
                            <div className="shrink-0">
                              {coverImagePreview ? (
                                <img
                                  id="preview_img"
                                  className="h-28 w-20 object-cover rounded-sm"
                                  src={coverImagePreview}
                                  alt="Cover image"
                                />
                              ) : (
                                <img
                                  id="preview_img"
                                  className="h-28 w-20 object-cover rounded-sm"
                                  src={book?.book.coverImage}
                                  alt="Cover image"
                                />
                              )}
                            </div>
                            <label className="block">
                              <span className="sr-only">
                                Choose cover image
                              </span>
                              <Input
                                type="file"
                                {...coverImageRef}
                                onChange={handleCoverImageChange}
                                className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-none
                      file:text-sm file:font-semibold
                      file:cursor-pointer
                      file:bg-violet-50 file:text-violet-700
                      hover:file:bg-violet-100 cursor-pointer h-auto
                    "
                              />
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="file"
                    render={() => (
                      <FormItem className="w-3/4">
                        <FormLabel>Book File PDF</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            className="block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-none
                          file:text-sm file:font-semibold
                          file:cursor-pointer
                          file:bg-violet-50 file:text-violet-700
                          hover:file:bg-violet-100 cursor-pointer h-auto"
                            {...fileRef}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </section>
  );
};

export default UpdateBook;
