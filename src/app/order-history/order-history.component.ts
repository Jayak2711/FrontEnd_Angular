import { Component, ElementRef, OnInit, ViewChild,AfterViewInit  } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { CartService } from '../services/cart.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { LoaderComponent } from "../../loader/loader.component";

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
  
})
export class OrderHistoryComponent implements AfterViewInit,OnInit{

  groupedOrders: { [key: number]: any[] } = {};
  dataSource = new MatTableDataSource<any>([]); // Initialize with an empty array
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns1: string[] = [
    'sno',
    'userId',
    'paymentId',
    'orderId',
    'productName',
    'price',
    'date',
    'quantity',
    'paymentMethod',
    'paymentStatus',
    'trackStatus',
    'totalAmount',
    'actions'
  ];

  displayedColumns: string[] = ['SNO', 'Order Id','Product Name','Price','Date','Quantity','Payment Method','Payment Status','DeliveryStatus','Total Amount'];
  orders: Order[] = [];
  orderAdmin :any ;
  currentUser: User | null = null;
  personalInfo: any;
  @ViewChild('pdfContent') pdfContent!: ElementRef;
  orderDownloadReport: any ;
  dateFromChart: string | null = '';
  createdDate: any;
  order_id: any;
  totalAmount: any;
  searchText: any;
  trackEdit: boolean = false;
trackRec: any;
trackRecValue: any;
  loading: boolean;
  constructor(private orderService: OrderService, private authService: AuthService,
    private cartservice:CartService,private toastr: ToastrService,private datePipe: DatePipe,
    private spinner: NgxSpinnerService) { }


  ngOnInit(): void {
    this.dateFromChart = sessionStorage.getItem('orderDate');
    this.currentUser = this.authService.getCurrentUser();
    if(this.currentUser.is_admin == false){
      this.getAllOrderWithUserId();
    }else{
      this.getOrderForAdmin();
    }
  }

  ngAfterViewInit() {
    // this.downloadPdf();
  }

  getOrderForAdmin(){
    this.orderService.getOrders().subscribe(res =>{
      this.orderAdmin = res.result;
      for(let i=0;i<this.orderAdmin.length;i++){
        const date = new Date(this.orderAdmin[i].payment_created_on);
        this.orderAdmin[i].payment_created_on = this.datePipe.transform(date, 'dd-MM-yyyy');
        this.orderAdmin[i]['totalamount'] = (parseInt(this.orderAdmin[i].product_price) * this.orderAdmin[i].order_quantity);
        this.orderAdmin[i]['trackStatus'] = false;
        this.orderAdmin = res.result;
        this.dataSource.data = this.orderAdmin;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
      console.log(this.dateFromChart)
      if(res.result){
        if(this.dateFromChart != null){
          this.getOrderByDate();
         }
      }
     
    })
  }



  getAllOrderWithUserId(){
    this.orderService.getAllOrderWithUserId(this.currentUser?.user_id).subscribe(res =>{ 
      this.orderAdmin = res.result;
      console.log(this.orderAdmin)
      console.log(this.orderAdmin)
      for(let i=0;i<this.orderAdmin.length;i++){
        const date = new Date(this.orderAdmin[i].payment_created_on);
        this.orderAdmin[i].payment_created_on = this.datePipe.transform(date, 'dd-MM-yyyy');
        this.orderAdmin[i]['totalamount'] = (parseInt(this.orderAdmin[i].product_price) * this.orderAdmin[i].order_quantity);
     }
    this.groupedOrders  =  this.groupByOrderId(this.orderAdmin);
      if(res.status == 200){
        this.userInfo();
      }
    })
  }

 
  removeOrder(orderId?: number) { 
    if (!orderId) {
      console.error('Invalid orderId:', orderId);
      return;
    }

    if (confirm('Are you sure you want to remove this order?')) {
      this.orderService.deleteOrder(orderId).subscribe(() => {
        this.orders = this.orders.filter(order => order.id !== orderId);
        console.log('Order removed successfully.');
      }, error => {
        console.error('Error removing order:', error);
      });
    }
  }

  exportAsPDF(orderId:number)
  {
    
    this.orderDownloadReport = this.orderAdmin[orderId];
    const content = this.pdfContent.nativeElement; 
      setTimeout(() =>{
        html2canvas(content).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('shop&me_invoice.pdf');
        });
        this.toastr.success('Success', 'Invoice Downloaded Successfully');
      },200)
   
  
  }


  userInfo(){
    this.authService.userPersonalDetails(this.currentUser?.user_id).subscribe(res => {
     this.personalInfo = res.result;
    })
  }


  getOrderByDate(){
    const orderDetails = this.orderAdmin.filter((a: any) => a.payment_created_on === this.dateFromChart);
    this.dataSource.data = orderDetails;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  formatDate(date: Date): string {
    console.log(date)
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // JavaScript months are 0-based
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  }

  groupByOrderId(array : any) {
    return array.reduce((acc : any, item : any) => {
      if (!acc[item.payment_id]) {
        acc[item.payment_id] = [];
      }
      acc[item.payment_id].push(item);
      return acc;
    }, {});
  }


// Method to get unique order_ids from the grouped orders
getOrderIds(): number[] {
  return Object.keys(this.groupedOrders).map(key => +key);
}


getOrderDetails(orderId: number) {
  const orderDetails = this.orderAdmin.filter((a: any) => parseInt(a.payment_id) === orderId);
  return orderDetails;
}

totalOrderRecord(orders :any){
  const totalPrice : number = (orders.reduce((sum : any, orders:any) => sum + parseInt(orders.totalamount), 0));
  return totalPrice;
}

downloadPdf(orderId : number) {
  this.spinner.show();
  this.userInfo();
  this.orderDownloadReport = this.getOrderDetails(orderId);
  console.log(this.orderDownloadReport)
  this.totalAmount = this.totalOrderRecord(this.orderDownloadReport);
  const content = this.pdfContent.nativeElement;
  this.createdDate = this.orderDownloadReport[0].payment_created_on;
  this.order_id = this.orderDownloadReport[0].order_id;
  setTimeout(() => {
  // Convert the HTML content to a canvas
  html2canvas(content).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    // Define the PDF size
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;
    const heightLeft = imgHeight;
    let position = 0;
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    position += pageHeight;
    // Save the PDF
    pdf.save('Shop&Me.pdf');
    this.spinner.hide();
  }).catch(error => {
    console.error('Error generating PDF:', error);
    this.spinner.hide();
  });
},500)
}

editTrack(id : any){
 for(let i=0;i<this.orderAdmin.length;i++){
  if(this.orderAdmin[i].order_id == id){
    this.orderAdmin[i].trackStatus = true;
  }

 }
}

close(id :any){
  for(let i=0;i<this.orderAdmin.length;i++){
    if(this.orderAdmin[i].order_id == id){
      this.orderAdmin[i].trackStatus = false;
    }
  
   }
}

save(id :any){
  let data = {
    'id' : id.payment_id,
    'trackrec' : this.trackRecValue
  }
  this.loading = true;
  setTimeout(() => {
  this.orderService.updateTrack(data).subscribe(res =>{ 
    if(res.status == 200){
      this.ngOnInit();
    }
  })
  this.loading = false;
},1000)
}

}