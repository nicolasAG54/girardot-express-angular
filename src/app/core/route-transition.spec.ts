import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { RouteCurtain } from './route-curtain';
import { routeTransition } from './route-transition';

@Component({ template: '<h1>Page</h1>' })
class PageStub {}

describe('routeTransition', () => {
  const cover = vi.fn<() => Promise<boolean>>();
  beforeEach(() => {
    cover.mockReset().mockResolvedValue(true);
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: PageStub, canActivate: [routeTransition] },
          { path: 'proyecto', component: PageStub, canActivate: [routeTransition] },
        ]),
        { provide: RouteCurtain, useValue: { cover } },
      ],
    });
  });

  it('leaves initial loads and same-page anchors immediate', async () => {
    const harness = await RouterTestingHarness.create('/');
    await harness.navigateByUrl('/#marcas');
    expect(cover).not.toHaveBeenCalled();
  });

  it('waits until the outgoing page is covered before committing the route', async () => {
    const harness = await RouterTestingHarness.create('/');
    const router = TestBed.inject(Router);
    let complete!: (value: boolean) => void;
    cover.mockImplementationOnce(() => new Promise(resolve => { complete = resolve; }));
    const navigation = harness.navigateByUrl('/proyecto');
    await vi.waitFor(() => expect(cover).toHaveBeenCalledOnce());
    expect(router.url).toBe('/');
    complete(true);
    await navigation;
    expect(router.url).toBe('/proyecto');
  });

  it('covers both directions and preserves destination fragments', async () => {
    const harness = await RouterTestingHarness.create('/');
    await harness.navigateByUrl('/proyecto#etapas');
    await harness.navigateByUrl('/#marcas');
    expect(cover).toHaveBeenCalledTimes(2);
    expect(cover).toHaveBeenNthCalledWith(1, expect.any(Number), 'to-project');
    expect(cover).toHaveBeenNthCalledWith(2, expect.any(Number), 'to-home');
    expect(TestBed.inject(Router).url).toBe('/#marcas');
  });

  it('does not commit a superseded destination when an earlier cover resolves', async () => {
    const harness = await RouterTestingHarness.create('/');
    let complete!: (value: boolean) => void;
    cover.mockImplementationOnce(() => new Promise(resolve => { complete = resolve; }));
    const superseded = harness.navigateByUrl('/proyecto');
    await vi.waitFor(() => expect(cover).toHaveBeenCalledOnce());
    await harness.navigateByUrl('/#marcas');
    complete(true);
    await superseded;
    expect(TestBed.inject(Router).url).toBe('/#marcas');
  });
});
