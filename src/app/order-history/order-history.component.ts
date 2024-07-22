import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { CartService } from '../services/cart.service';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
  
})
export class OrderHistoryComponent implements OnInit {


  orders: Order[] = [];
  orderAdmin :any ;
  currentUser: User | null = null;
  personalInfo: any;
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  orderDownloadReport: any ;
  constructor(private orderService: OrderService, private authService: AuthService,private cartservice:CartService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log(this.currentUser.user_id)
    if (this.currentUser) {
      this.loadOrdersForUser(this.currentUser.id);
    } else {
      console.error('User not authenticated.');
    
    }
    if(!this.currentUser.is_admin){
      this.getAllOrderWithUserId();
    }else{
      this.getOrderForAdmin();
    }
 
   
  }

  ngAfterViewInit() {
    const content = this.pdfContent.nativeElement;
    const elementsToHide = content.querySelectorAll('.hide-in-pdf');
    console.log(elementsToHide)
    elementsToHide.forEach((element: HTMLElement) => {
      element.style.display = 'none';
    });
  }

  getOrderForAdmin(){
    this.orderService.getOrders().subscribe(res =>{
      this.orderAdmin = res.result;
    })
  }


  getAllOrderWithUserId(){
    this.orderService.getAllOrderWithUserId(this.currentUser?.user_id).subscribe(res =>{
      this.orderAdmin = res.result;
      if(res.status == '200'){
        this.userInfo();
      }
    })
  }

  loadOrdersForUser(userId: number) {
    this.orderService.getOrdersForUser(userId).subscribe((orders) => {
      this.orders = orders;
    }, error => {
      console.error('Error fetching orders:', error);
    });
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
          pdf.save('download.pdf');
        });
        this.toastr.success('Success', 'Invoice Downloaded Successfully');
      },100)
   
  
  }


  userInfo(){
    this.authService.userPersonalDetails(this.currentUser?.user_id).subscribe(res => {
      console.log(res)
     this.personalInfo = res;
     console.log(this.personalInfo)
    })
  }
}