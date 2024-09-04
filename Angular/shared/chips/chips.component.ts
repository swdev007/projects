import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ITags } from 'src/app/pages/add-mint/interface/interface';
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss']
})
export class ChipsComponent implements OnInit, OnChanges, OnDestroy {

  constructor(private fb: FormBuilder) { }

  get tagsArrayform() {
    return this.form.controls.tags as FormArray
  }
  @Output() valueEmitter: EventEmitter<any> = new EventEmitter<any>()
  @Input() tags!: ITags[];
  @Input() selectedTags: string[] = [];
  @Input() readonly = false;
  chipsSelected: ITags[] = [];
  private _unsubscribeAll: Subject<void> = new Subject();
  form!: FormGroup;
  showSearchDropdown: boolean = false;
  searchText: string = "";
  searchTextEmitter = new Subject();
  searchedTags: ITags[] = [];
  dynamicTagsAdded: ITags[] = [];
  preSelectedTags: ITags[] = [];

  get hideLableGetter() {
    let showLable = false;
    if (this.preSelectedTags.length) {
      return true;
    }
    if (this.dynamicTagsAdded.length > 0) {
      return true;
    }
    this.tagsArrayform.value.forEach((el: boolean) => { showLable = showLable || el })
    return showLable;
  }

  get noSearchResult() {
    return this.searchedTags.length == 0;
  }
  ngOnInit(): void { }

  ngOnChanges(): void {
    this.initTagsFormsArray();
    this.createCheckBoxDynmaicForm();
    this.assignSearchTags();
    this.subscribeToformsArrayValueChanges();
    this.subscribeToSearchTextchange();
    this.subscribeToSelectedTags();
  }

  subscribeToSelectedTags() {
    this.preSelectedTags = [];

    this.selectedTags.forEach((el) => {
      this.preSelectedTags.push({ id: this.preSelectedTags.length, name: el, isActive: true, isGenre: false })
    })
  }

  subscribeToformsArrayValueChanges() {
    this.tagsArrayform.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((val) => {
      let arr = this.generateAndEmitSelectedChips(val);
      this.valueEmitter.emit(arr);
    })
  }

  generateAndEmitSelectedChips(val: boolean[]) {
    this.chipsSelected = [];
    val.forEach((el: any, index: number) => {
      if (el) this.chipsSelected.push(this.tags[index])
    })
    let dynamicTags: ITags[] = [];
    this.dynamicTagsAdded.forEach((el) => {
      dynamicTags.push(el);
    })
    return [...this.chipsSelected, ...dynamicTags];
  }
  subscribeToSearchTextchange() {
    this.searchTextEmitter.pipe(debounceTime(500), takeUntil(this._unsubscribeAll)).subscribe((val) => {
      this.searchedTags = []
      this.tags.forEach((el) => {
        if (el.name.toLowerCase().includes(this.searchText.toLowerCase())) {
          this.searchedTags.push(el);
        }
      })
    })
  }


  assignSearchTags() {
    this.searchedTags = this.tags;
  }
  initTagsFormsArray() {
    this.form = this.fb.group({
      tags: new FormArray([])
    })
  }
  createCheckBoxDynmaicForm() {
    this.tags.forEach(() => {
      this.tagsArrayform.push(new FormControl(false));
    })

  }
  showSearchDropdownHandler() {
    if (this.readonly) {
      return;
    }
    this.showSearchDropdown = !this.showSearchDropdown;
  }

  removePreselectedTags(index: number) {
    this.preSelectedTags = this.preSelectedTags.splice(1, index);
  }
  removeSelectedTag(id: number) {
    let currValue = this.tagsArrayform.value;
    let index = this.tags.findIndex((tag) => tag.id == id);
    if (index != -1) {
      currValue[index] = false;
      this.tagsArrayform.setValue(currValue);
    }
  }

  changeSearchValue(val: any) {
    this.searchTextEmitter.next(val);
  }


  removeDynamicTag(index: number) {
    this.dynamicTagsAdded = this.dynamicTagsAdded.splice(1, index);
  }

  selectTag() {
    let id: number = 0;
    this.dynamicTagsAdded.forEach((el) => {
      if (el.id > id) {
        id = el.id;
      }
    });
    this.dynamicTagsAdded.push({ name: this.searchText, id: id + 1, isActive: true, isGenre: false });
    this.searchText = "";
    let arr = this.generateAndEmitSelectedChips(this.tagsArrayform.value);
    this.valueEmitter.emit(arr);
    this.searchedTags = []
    this.tags.forEach((el) => {
      if (el.name.toLowerCase().includes(this.searchText.toLowerCase())) {
        this.searchedTags.push(el);
      }
    })
  }

  removeTags() {
    this.dynamicTagsAdded = [];
    let currValue: boolean[] = [];
    this.tagsArrayform.value.forEach(() => { currValue.push(false) });
    this.tagsArrayform.setValue(currValue);
  }
  checkIdInSearchedTags(index: number) {
    return this.searchedTags.findIndex(el => el.id == this.tags[index].id) == -1 ? false : true;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
