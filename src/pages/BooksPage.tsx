import { deleteBook, getBooks } from "@/http/api";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, CirclePlus, Loader } from "lucide-react";
import { Book } from "@/types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const BooksPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
    staleTime: 10000, // send request every 10 seconds to server
  });
  const queryClient = useQueryClient();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState({} as Book);

  const mutation = useMutation({
    mutationFn: (bookId: string) => deleteBook(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const handleDeleteClick = (book: Book) => {
    setSelectedBook(book);
    setIsAlertDialogOpen(true);
  };

  const closeAlertDialog = () => {
    setIsAlertDialogOpen(false);
    setSelectedBook({} as Book);
  };

  const handleConfirmDelete = () => {
    if (selectedBook) {
      mutation.mutate(selectedBook._id);
    }
    closeAlertDialog();
    toast(`Book ${selectedBook.title} Deleted Successfully! ✅ `);
  };

  const location = useLocation();
  const message = location.state?.message;

  useEffect(() => {
    if (message) {
      toast(message);
    }
    // Clear message state before potentially re-navigating
    navigate("/dashboard/books", { replace: true }); // Replace history entry
  }, [message, navigate]);

  console.log(data);
  // Function to format the date
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
    });
  };
  return (
    <>
      {isLoading ? (
        <div className="h-screen flex items-center justify-center animate-spin">
          <Loader />
        </div>
      ) : isError ? (
        <p className="text-red-500 h-screen flex items-center justify-center">
          {" "}
          An error occurred {error.message}
        </p>
      ) : (
        <div>
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Books</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Link to="/dashboard/books/create">
              <Button variant="default">
                {" "}
                <CirclePlus size={20} /> <span className="ml-2">Add Book</span>
              </Button>
            </Link>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Books</CardTitle>
              <CardDescription>
                Manage your Books and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Price
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Total Sales
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created at
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((book: Book) => (
                    <TableRow key={book._id}>
                      <TableCell className="hidden sm:table-cell">
                        <img
                          alt="Product image"
                          className="aspect-square rounded-sm object-cover h-24 w-16"
                          src={book.coverImage}
                        />
                      </TableCell>
                      <TableCell className="font-medium uppercase">
                        {book.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="whitespace-nowrap">
                          {book.genre}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        ${book.price}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">25</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(book.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <Link
                              to={`/dashboard/books/update/${book._id}`}
                              state={{ book: book }}
                            >
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(book)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-7</strong> of{" "}
                <strong>{data?.data.length}</strong> books
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      <AlertDialog open={isAlertDialogOpen} onOpenChange={closeAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              book and remove it from the list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleConfirmDelete}
            >
              Yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ToastContainer />
    </>
  );
};

export default BooksPage;
