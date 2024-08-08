import { ChangeDetectionStrategy, Component, computed, input, model, output } from "@angular/core";
import { PageEvent } from "./events/PageEvent";

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrl: 'paginator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class PaginatorComponent {
  pageIndex = model<number>(0);
  pageSize = model<number>(10);
  totalCount = input.required<number>();
  pageSizeOptions = input<number[]>([5, 10, 25]);

  hidePageSize = input(false);
  showFirstLastButtons = input(true);
  disabled = input(false);
  
  pageEventEmitter = output<PageEvent>();

  rangeLabel = computed(() => {
    if (this.totalCount() === 0 || this.pageSize() === 0) {
      return `0 of ${this.totalCount()}`;
    }

    length = Math.max(this.totalCount(), 0);

    const startIndex = this.pageIndex() * this.pageSize();
    const endIndex = startIndex < length ? Math.min(startIndex + this.pageSize(), length) : startIndex + this.pageSize();

    return `${startIndex + 1} - ${endIndex} of ${length}`;
  });

  onPageSizeChange(event: Event) {
    const eventPageSize = +(event.target as any as { value: number }).value;

    const startIndex = this.pageIndex() * this.pageSize();
    const previousPageIndex = this.pageIndex();

    this.pageIndex.set(Math.floor(startIndex / eventPageSize) || 0);
    this.pageSize.set(eventPageSize);

    this._emitPageEvent(previousPageIndex);
  }

  firstPage(): void {
    if (!this._hasPreviousPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex();
    this.pageIndex.set(0);

    this._emitPageEvent(previousPageIndex);
  }

  prevPage(): void {
    if (!this._hasPreviousPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex();
    this.pageIndex.set(this.pageIndex() - 1);

    this._emitPageEvent(previousPageIndex);
  }

  nextPage(): void {
    if (!this._hasNextPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex();
    this.pageIndex.set(this.pageIndex() + 1);
    
    this._emitPageEvent(previousPageIndex);
  }

  lastPage(): void {
    if (!this._hasNextPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex();
    this.pageIndex.set(this._pageCount() - 1);

    this._emitPageEvent(previousPageIndex);
  }

  private _pageCount = (): number => Math.ceil(this.totalCount() / this.pageSize());
  private _hasNextPage = (): boolean => this.pageIndex() < this._pageCount() - 1;
  private _hasPreviousPage = (): boolean => this.pageIndex() >= 1;

  private _emitPageEvent(previousPageIndex: number) {
    this.pageEventEmitter.emit({
      previousPageIndex,
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
      length: this._pageCount(),
    });
  }
}
